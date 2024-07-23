import express from "express";
import dotenv from "dotenv";
import { connect } from "../src/database/db.js";
import hotelRouter from "./routes/hotel.route.js";
// import connectEnsureLogin from "connect-ensure-login";
import session from "express-session";
import passport from "passport";
import authRouter from "./routes/auth.route.js";
import googleRouter from "./routes/google.auth.js";
// import cookieSession from "cookie-session";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4400;

//add middlewares
app.use(express.json());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 2* 60 * 60 * 1000 }, // 2 hr
	}));

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true}))
app.use(passport.initialize()); //initialise passport middleware
app.use(passport.session());

app.get("/", (req, res) => {
	res.send("Welcome to Lynkupp")
})

app.use("/auth",authRouter)
app.use(googleRouter)
app.use("api/v1/hotels", hotelRouter);

app.all("*", (req, res) => {
	res.status(404).json({ message: "Page not found" });
});

//connecting to the server and MongoDB
connect().then(() => {
	app.listen(PORT, () => {
		console.log(`Server is running on PORT ${PORT}`);
	});
});