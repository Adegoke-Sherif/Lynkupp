import { Router } from "express";
import HotelController from "../controllers/hotel.controller.js"

const hotelRouter = Router();

hotelRouter.post('/', HotelController.createHotel);  
hotelRouter.get('/', HotelController.getHotels);
hotelRouter.get('/:id', HotelController.getHotelById);
hotelRouter.put('/:id', HotelController.updateHotel);
hotelRouter.delete('/:id', HotelController.deleteHotel);


export default hotelRouter