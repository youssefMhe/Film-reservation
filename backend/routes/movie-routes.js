import express from "express";
import {addMovie, deleteMovieById, getAllMovies, getMovie} from "../controllers/movie-controller.js";


const movieRoutes = express.Router();

movieRoutes.get('/', getAllMovies)
movieRoutes.get('/:id', getMovie)
movieRoutes.post('/', addMovie)
movieRoutes.delete('/:id', deleteMovieById)
export default movieRoutes