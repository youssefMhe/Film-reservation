import bcrypt from 'bcryptjs';
import User from "../models/User.js";
import Booking from "../models/Booking.js";


export const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        return next(err)
    }
    if (!users) {
        return res.status(404).json({message: "No Users found"})
    }
    return res.status(200).json({users})
}

export const getUserById = async (req, res, next) => {

    const userId = req.params.id
    let user;
    try {
        user = await User.findById(userId)
    } catch (err) {
        next(err)
    }

    if (!user) {
        return res.status(404).json({message: "not exist User"})
    }
    return res.status(200).json({user: user})
}

export const signup = async (req, res, next) => {
    const {name, email, password} = req.body;

    if (!name && name.trim() === '' && !email && email.trim() === '' && !password && password.trim() === '') {
        return res.status(422).json({message: 'Invalid  inputs'})
    }
    let existingUser;
    try {
        existingUser = await User.findOne({email})
    } catch (err) {
        next(err)
    }
    if (existingUser) {
        return res.status(400).json({message: 'email Already used plz try other one '})
    }
    const hashedPassword = bcrypt.hashSync(password)
    let user;
    try {
        user = new User({name, email, password: hashedPassword});
        await user.save();
    } catch (err) {
        return next(err)
    }
    if (!user) {
        return res.status(500).json({message: 'unexpected error occurred'})
    }
    return res.status(201).json({user})
}

export const login = async (req, res, next) => {
    const {email, password} = req.body;
    if (!email && email.trim() === '' && !password && password.trim() === '') {
        return res.status(422).json({message: 'Invalid  inputs'})
    }
    let existingUser;
    try {
        existingUser = await User.findOne({email})
    } catch (err) {
        next(err)
    }
    if (!existingUser) {
        return res.status(404).json({message: 'User not already exist '})
    }
    const isCorrectPassword = bcrypt.compareSync(password, existingUser.password)

    if (!isCorrectPassword) {
        return res.status(400).json({message: 'check your information'})
    }
    return res.status(200).json({message: 'Login successfully'})
}


export const updateUser = async (req, res, next) => {

    const userId = req.params.id
    const {name, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password)
    if (!name && name.trim() === '' && !email && email.trim() === '' && !password && password.trim() === '') {
        return res.status(422).json({message: 'Invalid  inputs'})
    }

    let user;
    try {
        user = await User.findByIdAndUpdate(userId, {name, email, password: hashedPassword})
    } catch (err) {
        next(err)
    }
    if (!user) {
        return res.status(500).json({message: 'something went wrong'})
    }

    return res.status(200).json({message: 'update with success', user})
}


export const deleteUserById = async (req, res, next) => {
    const userId = req.params.id
    let user
    try {
        await User.findByIdAndRemove(userId);
    } catch (err) {
        next(err)
    }
    if (!user) {
        return res.status(500).json({message: "Unable to delete user "})
    }
    return res.status(200).json({message: "Delete with success"})
}

export const getBookingsOfUser = async (req, res, next) => {

    const userId = req.params.id
    let bookings
    try {
        bookings = await Booking.find({user: userId})
    } catch (e) {
        next(e)
    }
    if (!bookings) {
        return res.status(500).json({message: "not found bookingf "})
    }
    return res.status(200).json(bookings)
}
