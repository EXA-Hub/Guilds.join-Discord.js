const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  discordTag: { type: String, required: true },
  email: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  roles: { type: Array, required: true },
  nick: { type: String, required: true },
  mute: { type: Boolean, required: true },
  deaf: { type: Boolean, required: true },
});

const User = mongoose.model("users", UserSchema);

module.exports = User;
