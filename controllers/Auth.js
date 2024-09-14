import User from "../models/UserModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

// Issue JWT Token during login
export const Login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

        const match = await argon2.verify(user.password, req.body.password);
        if (!match) return res.status(400).json({ msg: "Password salah" });

        // Create JWT token with uuid, firstName, lastName, email, and role
        const token = jwt.sign(
            {
                uuid: user.uuid,  
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,  // Use the JWT secret from environment variable
            { expiresIn: '1h' }  // Token expires in 1 hour
        );

        // Return user details and the JWT token
        const { uuid, firstName, lastName, email, role } = user;
        res.status(200).json({ uuid, firstName, lastName, email, role, token });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
};

// Verify user by JWT token (used for `Me` route)
export const Me = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
    }

    const token = authHeader.split(' ')[1];  // Extract the JWT token from the Authorization header

    // Verify JWT token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ msg: "Token tidak valid" });

        try {
            // Find the user in the database using the decoded token's uuid
            const user = await User.findOne({
                attributes: ['uuid', 'firstName', 'lastName', 'email', 'role'],
                where: { uuid: decoded.uuid }  // Use uuid from the decoded token
            });

            if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ msg: "Internal server error" });
        }
    });
};

// No need for logout when using JWT, but we can provide a placeholder
export const logOut = (req, res) => {
    // Since we're using JWT, logout is handled on the client side (by removing the token).
    res.status(200).json({ msg: "Anda telah logout, silahkan hapus token dari client" });
};
