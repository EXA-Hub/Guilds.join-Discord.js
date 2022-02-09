module.exports = (client) => {
  const express = require("express");
  const app = express();
  app.use(express.json());
  const session = require("express-session");
  const MongoStore = require("connect-mongo");
  const User = require("../data/mongo");
  const DiscordOauth2 = require("discord-oauth2");
  const oauth = new DiscordOauth2();

  app.use(
    session({
      resave: false,
      secret: client.config.secret,
      saveUninitialized: false,
      cookie: { maxAge: 86400000 },
      store: MongoStore.create({
        mongoUrl: "mongodb://localhost:27017/guildsJoin",
      }),
    })
  );

  app.use((req, res, next) => {
    next();
  });

  const { Router } = require("express");

  const router = Router();

  const CLIENT_ID = client.user.id,
    CLIENT_SECRET = client.config.secret,
    CLIENT_CALLBACK_URL = client.config.redirect_url;

  const Passport = require("passport");
  const { Strategy } = require("passport-discord");

  Passport.serializeUser((user, done) => {
    done(null, user.userId);
  });

  Passport.deserializeUser(async (userId, done) => {
    const user = await User.findOne({ userId });
    return user && done(null, user);
  });

  const passport = Passport.use(
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
          oauth.addMember({
            accessToken: userData.accessToken,
            guildId: client.config.serverID,
            userId: userData.userId,
            botToken: client.token,
          });
        } catch (e) {
          done(e);
        }
      }
    )
  );

  app.use(passport.initialize());
  app.use(passport.session());

  router.get("/discord/", passport.authenticate("discord"));

  router.get(
    "/discord/redirect/",
    passport.authenticate("discord"),
    (req, res) => {
      req.session.user = req.user;
      res.send(req.user);
    }
  );

  router.get("/", async (req, res) => {
    req.user = req.session.user;
    if (!req.user) return res.sendStatus(401);
    res.send({
      userId: req.user.userId,
      discordTag: req.user.discordTag,
    });
  });

  // Logout endpoint.
  router.get("/logout", function (req, res) {
    req.session.destroy(() => {
      req.logout();
      res.status(200);
    });
  });

  const authenticationRouter = router;
  app.use("/api/auth", authenticationRouter);

  app.all("/:param?", (req, res) => {
    res.send({
      query: req.query,
      params: req.params,
      body: req.body,
    });
  });

  app.use((req, res, next) => {
    res
      .status(404)
      .send(app._router.stack.filter((r) => r.route).map((r) => r.route.path));
  });

  const PORT = client.config.port || 3001;
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
};
