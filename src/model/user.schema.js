import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";


const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please fill a valid email address']
	},
	password: {
		type: String,
	},

	}, {
		timestamps: true
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email", // Use 'email' as the username field
	// usernameLowerCase: true,
});
// 	{
// 		username: {
// 			type: String,
// 			required: [true, "Please enter your email"],
// 			// match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,"Please fill a valid email address"],
// 			unique: true,
// 			lowercase: true,
// 		},
// 	},
// 	{
// 		timestamps: true,
// 	}
// );

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
const userModel = mongoose.model("userModel", userSchema);

export default userModel;
