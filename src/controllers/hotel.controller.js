import HotelService from "../services/hotel.service.js"

//Create Hotel
class HotelController {
  static async createHotel(req, res) {
    try {
      const hotelData = req.body;
      const createdHotel = await HotelService.createHotel(hotelData);
      res.status(201).json(createdHotel);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //Get All Hotels
  static async getHotels(req, res) {
    try {
      const hotels = await HotelService.getHotels();
      res.status(200).json(hotels);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //Get Hotels By ID
  static async getHotelById(req, res) {
    try {
      const hotelId = req.params.id;
      const hotel = await HotelService.getHotelById(hotelId);
      if (!hotel) {
        res.status(404).json({ message: 'Hotel not found' });
      } else {
        res.status(200).json(hotel);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //Update Hotel
  static async updateHotel(req, res) {
    try {
      const hotelId = req.params.id;
      const hotelData = req.body;
      const updatedHotel = await HotelService.updateHotel(hotelId, hotelData);
      if (!updatedHotel) {
        res.status(404).json({ message: 'Hotel not found' });
      } else {
        res.status(200).json(updatedHotel);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete Hotel
  static async deleteHotel(req, res) {
    try {
      const hotelId = req.params.id;
      const deleted = await HotelService.deleteHotel(hotelId);
      if (!deleted) {
        res.status(404).json({ message: 'Hotel not found' });
      } else {
        res.status(204).send("Hotel Deleted successfully");
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default HotelController;
