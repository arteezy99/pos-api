import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const verifyUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if the authorization header is present
    if (!authHeader) {
        return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
    }

    const token = authHeader.split(' ')[1];  // Extract JWT token

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ msg: "Token tidak valid" });
        }

        // Find the user in the database using the decoded token's uuid
        const user = await User.findOne({
            where: {
                uuid: decoded.uuid 
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        // Attach user details to the request object
        req.userId = user.uuid;
        req.role = user.role;
        next();  // Proceed to the next middleware
    });
}

export const adminOnly = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if the authorization header is present
    if (!authHeader) {
        return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
    }

    const token = authHeader.split(' ')[1];  // Extract JWT token

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ msg: "Token tidak valid" });
        }

        // Find the user in the database using the decoded token's uuid
        const user = await User.findOne({
            where: {
                uuid: decoded.uuid 
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        // Check if the user has admin privileges
        if (user.role !== "admin") {
            return res.status(403).json({ msg: "Akses terlarang" });
        }

        next();  // Proceed to the next middleware
    });
}
