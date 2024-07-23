import { Router } from 'express';
import  passport  from "../Auth/google.js";
// import passport from "passport"
// import cookieSession from 'cookie-session';

const googleRouter = Router();

googleRouter.get("/success", (req, res) => {
  console.log(req.user);
  res.send(`Welcome $(req.user.email)`)

  Router.get("failed", (req, res) => {
    res.send("Failed to authenticate")
  })
})
googleRouter.get("/google", passport.authenticate('google', {
  scope: ['email', 'profile']
}));

googleRouter.get("/google-auth/callback", passport.authenticate("google", { failureRedirect: "/failed"}),
  function(req, res) {
    res.redirect("success")
  }
);

googleRouter.get("/google/logout", (req, res) => {
  req.session = null;
  req.logout(err => {
    if (err) {
      return next(err);  
    }
    res.redirect('/success');
  });
});

export default googleRouter;

