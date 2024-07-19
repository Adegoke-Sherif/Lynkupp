import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { connect } from "../src/database/db.js";
import hotelRouter from "./routes/hotel.route.js";
import passport from "passport";
import connectEnsureLogin from "connect-ensure-login";
import session from "express-session";
import userModel from "./model/user.schema.js";
import TestUser from "./model/test_user.schema.js";
import { Strategy as LocalStrategy } from "passport-local";
import morgan from "morgan";
import { verify, hash } from "argon2";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4400;

//add middlewares
app.use(express.json());
app.use("api/v1/hotels", hotelRouter);
app.use(morgan("dev"));
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 60 * 60 * 1000 }, // 1 hr
	})
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize()); //initialise passport middleware
app.use(passport.session());

// ! passport.use(userModel.createStrategy());

//serialize and deserialise user object to and from the session
// passport.serializeUser(userModel.serializeUser());
// passport.deserializeUser(userModel.deserializeUser());

passport.serializeUser((user, done) => {
	done(null, { id: user.id, username: user.email });
});

// Deserialize user
passport.deserializeUser((id, done) => {
	const user = TestUser.findById(id);
	if (!user) return done(null, false);
	return done(null, user);
});

passport.use(
	new LocalStrategy(
		{ usernameField: "email", passwordField: "password" },
		async (email, password, done) => {
			// TestUser.findOne({ email }, function (err, user) {
			// 	if (err) {
			// 		return done(err);
			// 	}
			// 	if (!user) {
			// 		return done(null, false);
			// 	}
			// 	if (!user.verifyPassword(password)) {
			// 		return done(null, false);
			// 	}

			// });
			const user = await TestUser.findOne({ email });

			if (!user) return done(null, false);

			if (!(await verify(user.password, password)))
				return done(null, false);
			// if (user.password !== password) return done(null, false);

			return done(null, user);
		}
	)
);

app.set("view engine", "ejs");
app.set("views", "src/views");

//Secure the route
app.use("/books", connectEnsureLogin.ensureLoggedIn(), hotelRouter);

//render the home page
app.get("/", (req, res) => {
	console.log(req.session);
	if (req.session.passport) {
		res.send(`Hello, ${req.session.passport.user.username}`);
	} else {
		res.send("Please log in");
	}
});

//render the login page
app.get("/login", (req, res) => {
	res.render("login");
});

app.get("/signup", (req, res) => {
	const error = req.query.error; // Or however you are getting the error
	res.render("signup", { error });
});

//creating new user

// renders password reset page

app.get("/reset", (req, res) => {
	res.render("reset", { error: null, success: null });
});

// handles the signup request for new users

// app.post("/signup", (req, res) => {
// 	const {
// 		body: { email, password },
// 	} = req;
// 	userModel.register(new userModel({ email }), password, (err, user) => {
// 		if (err) {
// 			console.log(err);
// 			res.render("signup", { error: err });
// 		} else {
// 			passport.authenticate("local")(req, res, () => {
// 				res.redirect("/books");
// 			});
// 		}
// 	});
// });

app.post("/signup", async (req, res) => {
	const {
		body: { email, password },
	} = req;
	const userExists =
		(await TestUser.find({ email })).length > 0 ? true : false;

	if (userExists) {
		return res.json({ error: "Email already exists." });
	}

	console.log(email, password);
	const user = await TestUser.create({
		email,
		password: await hash(password),
	});
	return res.json({ success: true, data: user });
});

// handles the login request for existing users
// app.post(
// 	"/login",
// 	passport.authenticate("local", { failureRedirect: "/login" }),
// 	(req, res) => {
// 		res.redirect("/books");
// 	}
// );

app.post("/login", passport.authenticate("local"), (req, res) => {
	return res.json({
		message: "Success",
		data: req.session.passport.user,
	});
});

// handles the logout request
app.post("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

// handles the change password request
app.post("/reset", (req, res) => {
	const userInfo = req.body;
	userModel.findOne({ username: userInfo.username }, (err, user) => {
		if (err) {
			console.log(err);
			res.render("reset", { error: err });
		} else {
			user.changePassword(
				userInfo.password,
				userInfo.new_password,
				(err, user) => {
					if (err) {
						console.log(err);
						res.status(500).send(err);
					} else {
						res.render("reset", {
							error: null,
							success: "Password changed successfully!",
						});
					}
				}
			);
		}
	});
});

//catch errors middleware
app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).send("Something broke!");
});

app.all("*", (req, res) => {
	res.status(404).json({ message: "Page not found" });
});

//connecting to the server and MongoDB
connect().then(() => {
	app.listen(PORT, () => {
		console.log(`Server is running on PORT ${PORT}`);
	});
});

// app.listen(PORT, () => {
//   connect()
//   console.log(`server is running on PORT ${PORT}`)
// })
