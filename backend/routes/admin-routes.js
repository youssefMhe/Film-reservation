import express from "express";
import {addAdmin, adminLogin, getAllAdmins} from "../controllers/admin-controller.js";


const adminRoutes = express.Router();

adminRoutes.get('/', getAllAdmins)
adminRoutes.post('/signup', addAdmin)
adminRoutes.post('/login', adminLogin)

export default adminRoutes