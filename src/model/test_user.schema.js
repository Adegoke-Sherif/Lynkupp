import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const schema = new mongoose.Schema(
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

schema.plugin(passportLocalMongoose);

const TestUser = mongoose.model("TestUser", schema);

export default TestUser;
