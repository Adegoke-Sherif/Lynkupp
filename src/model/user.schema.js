import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
  }
}, {
  timestamps: true
});

userSchema.plugin(passportLocalMongoose);

const userModel = mongoose.model("userModel", userSchema);

export default userModel;

