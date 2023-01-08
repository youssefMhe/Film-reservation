import Movie from "../models/Movie.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";


export const getAllMovies = async (req, res, next) => {
    let movies;
    try {
        movies = await Movie.find();
    } catch (err) {
        return next(err)
    }
    if (!movies) {
        return res.status(500).json({message: "No Movies found"})
    }
    return res.status(200).json({movies})
}

export const getMovie = async (req, res, next) => {
    const movieId = req.params.id
    let movie;


    try {
        movie = await Movie.findById(movieId);
    } catch (err) {
        return next(err)
    }
    if (!movie) {
        return res.status(404).json({message: "Invalid Id"})
    }
    return res.status(200).json({movie})
}

export const addMovie = async (req, res, next) => {
    const extractedToken = req.headers.authorization.split(" ")[1];
    if (!extractedToken && extractedToken.trim() === "") {
        return res.status(404).json({message: "Not found token authorization "});
    }
    //verify token
    let adminId;
    jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
        if (err) {
            return res.status(400).json({message: `${err.message}`});
        } else {
            adminId = decrypted.id;
        }
    })
    //create the new movie
    const {title, description, releaseDate, posterUrl, featured, actors} = req.body;
    if (
        !title &&
        !description &&
        !posterUrl) {
        return res.status(422).json({message: 'incorrect imputes'}
        )
    }
    let movie;
    try {
        movie = new Movie({
            title,
            description,
            releaseDate: new Date(`${releaseDate}`),
            actors,
            posterUrl,
            featured,
            admin: adminId
        });

        //synchronise with user data
        const session = await mongoose.startSession()
        const adminUser = await Admin.findById(adminId)
        session.startTransaction()
        await movie.save({session});
        adminUser.addedMovies.push(movie)
        await adminUser.save({session});
        // close session
        await session.commitTransaction();

    } catch (err) {
        console.log(err.message)
        return next(err)
    }
    if (!movie) {
        return res.status(500).json({message: 'unexpected error occurred: Request failed '});
    }
    return res.status(201).json({movie});
}

export const deleteMovieById = async (req, res, next) => {

    const extractedTokenReq = req.headers.authorization.split(" ")[1];
    if (!extractedTokenReq && extractedTokenReq.trim() === "") {
        return res.status(404).json({message: "Not found token authorization "});
    }
    //verify token
    let adminId;
    jwt.verify(extractedTokenReq, process.env.SECRET_KEY, (err, decrypted) => {
        if (err) {
            return res.status(400).json({message: `${err.message}`});
        } else {
            adminId = decrypted.id;
        }
    })
    const movieId = req.params.id
    let movie
    try {
        //synchronise with user data
        const session = await mongoose.startSession()
        session.startTransaction()
        const adminUser = await Admin.findById(adminId)
        movie = await Movie.findOneAndRemove({admin: adminId, _id: movieId});
        adminUser.addedMovies.delete(movie)
        await adminUser.save({session});
        // close session
        await session.commitTransaction();

    } catch (err) {
        next(err)
    }
    if (!movie) {
        return res.status(500).json({message: "Unable to delete user "})
    }
    return res.status(200).json({message: "Delete with success"})
}
