const jwt = require("jsonwebtoken");
const db = require("../config/db");

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '1d'})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '10d'})

    return {accessToken, refreshToken}
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      return userData
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    } catch (e) {
      return null;
    }
  }

  async removeToken(refreshToken) {
    const updatedUser = await db.query(
        `DELETE
         FROM tokens
         WHERE refresh_token = $1 RETURNING *`,
        [refreshToken]
    );

    return updatedUser.rows;
  }

  async saveToken(userId, refreshToken) {
    const findUserById = await db.query(
        `SELECT *
         FROM tokens
         where user_id = $1`,
        [userId]
    );

    if (!!findUserById.rows.length) {
      return await db.query(
          `UPDATE tokens
           SET refresh_token = $1
           WHERE user_id = $2 RETURNING *`,
          [refreshToken, userId]
      )
    }

    return await db.query(
        `INSERT INTO tokens (refresh_token, user_id)
         VALUES ($1, $2) RETURNING *`,
        [refreshToken, userId]
    )
  }
}

module.exports = new TokenService()
