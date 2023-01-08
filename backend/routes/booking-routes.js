import express from "express";
import {deleteBookingById, getAllBookings, newBooking} from "../controllers/booking-controller.js";

const bookingRoutes = express.Router();

bookingRoutes.get('/', getAllBookings)
bookingRoutes.post('/', newBooking)
bookingRoutes.delete('/:id', deleteBookingById)
export default bookingRoutes