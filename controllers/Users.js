import User from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async(req, res) =>{
    try {
        const response = await User.findAll({
            attributes:['uuid','firstName', 'lastName','email', 'gender', 'birthDate', 'role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getUserById = async(req, res) =>{
    try {
        const response = await User.findOne({
            attributes:['uuid','firstName', 'lastName','email', 'gender', 'birthDate', 'role'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createUser = async(req, res) =>{
    const { firstName, lastName, email, password, confPassword, gender, birthDate, role } = req.body;
    // check duplicate email
    const check = await User.findOne({
        where: {
            email: email
        }
    });
    if(check) return res.status(400).json({msg: "Email sudah terdaftar"});
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    const hashPassword = await argon2.hash(password);
    try {
        await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashPassword,
            gender: gender,
            birthDate: birthDate,
            role: role
        });
        res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updateUser = async (req, res) => {
    try {
        // Find the user by UUID
        const user = await User.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

        const { firstName, lastName, email, password, confPassword, gender, birthDate, role } = req.body;

        // Declare variable for hashed password
        let hashPassword = user.password;

        // Only process password if it's provided in the request body
        if (password && password !== "") {
            // Check if password and confirm password match
            if (password !== confPassword) {
                return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
            }

            // Hash the new password
            hashPassword = await argon2.hash(password);
        }

        // Update the user with the new data
        await user.update({
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            email: email || user.email,
            password: hashPassword, // Update the password if it was provided
            gender: gender || user.gender,
            birthDate: birthDate || user.birthDate,
            role: role || user.role
        });

        res.status(200).json({ msg: "User Updated" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const deleteUser = async(req, res) =>{
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    try {
        await User.destroy({
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "User Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}