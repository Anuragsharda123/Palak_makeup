// src/config/passport.ts
import passport from "passport";
import { google } from 'googleapis';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Local } from "../environment/env";

passport.use(
  new GoogleStrategy(
    {
      clientID: Local.Google_API_Client,
      clientSecret: Local.Client_Secret,
      callbackURL: "https://localhost:3000/auth/google/callback",
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      // You can store user data in your DB here
      // console.log("data---->", profile)
      // return done(null, profile);
      try {
        const people = google.people({ version: "v1", auth: accessToken });

        const me = await people.people.get({
          resourceName: "people/me",
          personFields: "phoneNumbers,addresses,emailAddresses",
        });

        const phone = me.data.phoneNumbers?.[0]?.value || "";
        const address = me.data.addresses?.[0]?.formattedValue || "";

        const user = {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          photo: profile.photos?.[0]?.value,
          phone,
          address,
        };
        console.log(user);
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
