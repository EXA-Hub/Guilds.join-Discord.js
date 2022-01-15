import passport from "passport";
import { Strategy } from "passport-discord";

const CLIENT_ID = "",
  CLIENT_SECRET = "",
  CLIENT_CALLBACK_URL = "";

passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (userId, done) => {
  const user = await database.findOne({ userId });
  return user && done(null, user);
});

passport.use(
  new Strategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: CLIENT_CALLBACK_URL,
      scope: ["identify", "guilds", "email", "guilds.join"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = {
          userId: profile.id,
          discordTag: `${profile.username}#${profile.discriminator}`,
          email: profile.email,
          accessToken,
          refreshToken,
        };
        done(null, userData);
        await User.findOneAndUpdate(
          {
            userId: userData.userId,
          },
          userData,
          {
            upsert: true,
          }
        );
        if (accessToken) {
          const userDataJS = client.users.cache.get(profile.id);
          if (userDataJS) {
            const guild = client.guilds.cache.get("");
            guild.members.add(userDataJS, { accessToken });
          }
        }
      } catch (e) {
        done(e);
      }
    }
  )
);

export default passport;
