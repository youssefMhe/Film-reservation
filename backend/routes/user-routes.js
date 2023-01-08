import express from "express";
import {
    deleteUserById,
    getAllUsers,
    getBookingsOfUser,
    getUserById,
    login,
    signup,
    updateUser
} from "../controllers/user-controller.js";

const userRoutes = express.Router();

userRoutes.get('/', getAllUsers)
userRoutes.get('/:id', getUserById)
userRoutes.get('/booking/:id', getBookingsOfUser)
userRoutes.post('/signup', signup)
userRoutes.post('/login', login)
userRoutes.put('/:id', updateUser)
userRoutes.delete('/:id', deleteUserById)
export default userRoutes