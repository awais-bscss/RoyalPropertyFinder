import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../../src/modules/user/user.model";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "MOCK_CLIENT_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "MOCK_CLIENT_SECRET",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        const profilePic = profile.photos?.[0].value || "";

        if (!email) {
          return done(new Error("No email found from Google profile"), undefined);
        }

        // 1. Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // 2. Check if a user signed up with this email traditionally before using Google
        user = await User.findOne({ email });

        if (user) {
          // Link Google to their existing account
          user.googleId = profile.id;
          if (user.authProvider === "email") {
            user.authProvider = "google"; // Might just mark it as multi-auth, depending on logic
          }
          await user.save();
          return done(null, user);
        }

        // 3. Brand newly discovered user! Create them in the DB!
        const newUser = await User.create({
          googleId: profile.id,
          name: profile.displayName || "Unknown Name",
          email: email,
          profilePic: profilePic,
          authProvider: "google",
          role: "user",
        });

        return done(null, newUser);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID || "MOCK_APP_ID",
      clientSecret: process.env.FACEBOOK_APP_SECRET || "MOCK_APP_SECRET",
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || "/api/v1/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        const email = profile.emails?.[0].value;
        const profilePic = profile.photos?.[0].value || "";

        if (!email) {
          return done(new Error("No email found from Facebook profile"), undefined);
        }

        // 1. Check if user already exists with this Facebook ID
        let user = await User.findOne({ facebookId: profile.id });

        if (user) {
          return done(null, user);
        }

        // 2. Check if a user signed up with this email traditionally before using Facebook
        user = await User.findOne({ email });

        if (user) {
          // Link Facebook to their existing account
          user.facebookId = profile.id;
          if (user.authProvider === "email") {
            user.authProvider = "facebook"; 
          }
          await user.save();
          return done(null, user);
        }

        // 3. Brand newly discovered user! Create them in the DB!
        const newUser = await User.create({
          facebookId: profile.id,
          name: profile.displayName || "Unknown Name",
          email: email,
          profilePic: profilePic,
          authProvider: "facebook",
          role: "user",
        });

        return done(null, newUser);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

// We generally don't need serialize/deserialize if we generate completely stateless JWT tokens on successful OAuth,
// But some frameworks require it. We will bypass it by using { session: false } in our routes,
// but leaving this here in case you want stateful sessions later.
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
