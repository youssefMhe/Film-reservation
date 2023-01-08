import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";


export const getAllBookings = async (req, res, next) => {
    let bookings;
    try {
        bookings = await Booking.find();
    } catch (err) {
        return next(err)
    }
    if (!bookings) {
        return res.status(500).json({message: "No bookings found"})
    }
    return res.status(200).json({bookings})
}

export const newBooking = async (req, res, next) => {

    const {movie, date, seatNumber, user} = req.body;
    let existingMovie;
    let existingUser;
    try {
        existingMovie = await Movie.findById(movie);
        existingUser = await User.findById(user);
    } catch (err) {
        return next(err)
    }
    if (!existingMovie) {
        return res.status(404).json({message: "Movie not found"})
    }
    if (!existingUser) {
        return res.status(404).json({message: "User not found"})
    }

    let booking;
    try {
        booking = new Booking({movie, date: new Date(`${date}`), seatNumber, user})
        //synchronise with movie and user data
        const session = await mongoose.startSession()
        session.startTransaction()
        existingUser.bookings.push(booking)
        existingMovie.bookings.push(booking)
        await existingMovie.save({session});
        await existingUser.save({session});
        await booking.save({session});
        // close session
        await session.commitTransaction();

    } catch (err) {
        return next(err)
    }
    if (!booking) {
        return res.status(500).json({message: "Enable to create a booking "})
    }
    return res.status(201).json({booking})
}


export const deleteBookingById = async (req, res, next) => {
    const id = req.params.id
    let booking
    try {
        booking = await Booking.findByIdAndRemove(id).populate("user movie")
        const session = await mongoose.startSession()
        session.startTransaction()
        await booking.user.bookings.pull(booking);
        await booking.movie.bookings.pull(booking);
        await booking.movie.save({session});
        await booking.user.save({session});
        await session.commitTransaction();
    } catch (err) {
        next(err)
    }

    if (!booking) {
        return res.status(500).json({message: "Enable delete "})
    }
    return res.status(200).json({message: "delete successfully  "})
}