// src/config/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Local } from "../environment/env";

passport.use(
  new GoogleStrategy(
    {
      clientID: Local.Google_API_Client,
      clientSecret: Local.Client_Secret,
      callbackURL: "http://localhost:3000/auth/google/callback", // NOTE: use http not https on localhost
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const user = {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          photo: profile.photos?.[0]?.value,
        };
        console.log("Authenticated user:", user);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});
