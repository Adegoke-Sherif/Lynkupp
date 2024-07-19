import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: [true, "Please enter your email"],
			match: [
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				"Please fill a valid email address",
			],
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: [true, "Please enter your email"],
		},
	},
	{
		timestamps: true,
	}
);

userSchema.plugin(passportLocalMongoose);

const userModel = mongoose.model("userModel", userSchema);

export default userModel;
