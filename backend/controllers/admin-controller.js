import bcrypt from 'bcryptjs';
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken"

export const getAllAdmins = async (req, res, next) => {
    let admins;
    try {
        admins = await Admin.find().populate('addedMovies');
        /*description with some precises details
        admins = await Admin.find().populate('addedMovies',{description:1}); */
    } catch (err) {
        return next(err)
    }
    if (!admins) {
        return res.status(404).json({message: "No Admins found"})
    }
    return res.status(200).json({admins})
}


export const addAdmin = async (req, res, next) => {
    const {email, password} = req.body;

    if (!email && email.trim() === '' && !password && password.trim() === '') {
        return res.status(422).json({message: 'Invalid  inputs'})
    }
    let existingAdmin;
    try {
        existingAdmin = await Admin.findOne({email})
    } catch (err) {
        next(err)
    }

    if (existingAdmin) {
        return res.status(400).json({message: 'email Already used fo admin plz try other one'})
    }
    const hashedPasswordAdmin = bcrypt.hashSync(password)
    let admin;
    try {
        admin = new Admin({email, password: hashedPasswordAdmin});
        await admin.save();
    } catch (err) {
        return next(err)
    }
    if (!admin) {
        return res.status(500).json({message: 'unexpected error occurred'})
    }
    return res.status(201).json({admin})
}


export const adminLogin = async (req, res, next) => {
    const {email, password} = req.body;

    if (!email && !password) {
        return res.status(422).json({message: 'Invalid  inputs'})
    }
    let existingAdmin;
    try {
        existingAdmin = await Admin.findOne({email})
    } catch (err) {
        next(err)
    }
    console.log(existingAdmin)
    if (!existingAdmin) {
        return res.status(400).json({message: 'unexpected error occurred'})
    }


    const isCorrectPassword = bcrypt.compareSync(password, existingAdmin.password)
    const token = jwt.sign({
        id: existingAdmin._id,
        email: existingAdmin.email
    }, process.env.SECRET_KEY, {expiresIn: "7d"})
    if (!isCorrectPassword) {
        return res.status(400).json({message: 'check your information'})
    }
    return res.status(200).json({message: 'authenticated successfully', token, id: existingAdmin._id})

}