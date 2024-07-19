import Hotel from "../model/hotel.schema.js"

class HotelService {
  static async createHotel(hotelData) {
    const createdHotel = await Hotel.create(hotelData);
    return createdHotel;
  }

  static async getHotels() {
    const hotels = await Hotel.find();
    return hotels;
  }

  static async getHotelById(hotelId) {
    const hotel = await Hotel.findById(hotelId);
    return hotel;
  }

  static async updateHotel(hotelId, hotelData) {
    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, hotelData, { new: true });
    return updatedHotel;
  }

  static async deleteHotel(hotelId) {
    const deleted = await Hotel.findByIdAndDelete(hotelId);
    return deleted !== null;
  }
}

export default HotelService;
