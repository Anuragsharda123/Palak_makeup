// src/config/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Local } from "../environment/env";

passport.use(
  new GoogleStrategy(
    {
      clientID: Local.Google_API_Client,
      clientSecret: Local.Client_Secret,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // You can store user data in your DB here
      console.log("data---->", profile)
      return done(null, profile);
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});
