const jwt = require("jsonwebtoken");
const db = require("../utils/db");

class tokenModel {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });
    return { accessToken, refreshToken };
  }

  async saveTokens(userId, refreshToken) {
    const tokenData = await this.findTokenByUserId(userId);
    if (tokenData) {
      await db
        .update({ token: refreshToken })
        .into("token")
        .where({ user_id: userId });
    } else {
      await db.insert({ user_id: userId, token: refreshToken }).into("token");
    }
  }

  async validateRefreshToken(refreshToken) {
    try {
      const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (err) {
      return null;
    }
  }

  async findToken(refreshToken) {
    const token = await db
      .first({ user_id: "user_id", token: "token" })
      .from("token")
      .where({ token: refreshToken });
    return token;
  }

  async findTokenByUserId(userId) {
    const token = await db
      .first({ user_id: "user_id", token: "token" })
      .from("token")
      .where({ user_id: userId });
    return token;
  }

  async removeToken(refreshToken) {
    await db.delete().from("token").where({ token: refreshToken });
  }
}

module.exports = new tokenModel();
