import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true,
  },
  photos: {
    type: [String],
  },
  shortDescription: {
    type: String,
    required: true
  },
  rooms: {
    type: [String],
  },
  price: {
    type: Number,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });  

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
