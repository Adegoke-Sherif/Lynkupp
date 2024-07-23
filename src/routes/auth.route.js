import { Router } from "express";
import passport from "passport";
import userModel from "../model/user.schema.js" // Adjust path as necessary

const authRouter = Router();

//serialize and deserialise user object to and from the session
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

passport.use(userModel.createStrategy());

authRouter.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const newUser = await userModel.register({ email }, password);
    res.status(201).json({ message: 'Registration successful', user: newUser });
  } catch (err) {
    // Handle validation errors or duplicate key errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    } else if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Login route
authRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: "Login successful", user: req.user });
    });
  })(req, res, next);
});


// Logout route
authRouter.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to destroy session' });
     }
      res.json({ message: 'Logout successful' });
    });
  });
});

export default authRouter;