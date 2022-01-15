import { Router } from "express";
import passport from "./strategy";

const router = Router();

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
    guilds: req.user.guilds,
    userId: req.user.userId,
    discordTag: req.user.discordTag,
    coins: await require("../../../functions/getCoins")(req.user.userId),
  });
});

// Logout endpoint.
router.get("/logout", function (req, res) {
  req.session.destroy(() => {
    req.logout();
    res.send({ message: "loged out" });
  });
});

export default router;
