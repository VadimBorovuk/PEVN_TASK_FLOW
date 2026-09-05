const db = require('../config/db')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')
const tokenService = require('./tokenService')
const mailService = require('./mailService')
const UserDto = require('../dtos/userDto');
const ApiError = require('../exceptions/api-error')

class UserService {
  async getAll() {
    const getAllRows = await db.query(
        `SELECT *
         FROM users;`
    );

    return getAllRows.rows
  }

  async getById(id) {
    const findUserById = await db.query(
        `SELECT *
         FROM users
         where id = $1`,
        [id]
    );
    return findUserById.rows
  }

  async signUp(body) {
    const {name, email, password, position = 'guest'} = body;
    const user = await db.query(
        `SELECT *
         FROM users
         WHERE email = $1`, [email]
    )
    if (!!user.rows.length) {
      throw ApiError.BadRequest(`User already exist with email - ${email}`)
    }

    const passwordHash = await bcrypt.hashSync(password);
    const activationLink = uuid.v4();

    const newUser = await db.query(
        `INSERT INTO users (name, email, password_hash, position, activation_link)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, email, passwordHash, position, activationLink]
    );

    try {
      await mailService.sendActivationMail(
          email,
          `${process.env.API_URL}/api/user/activate/${activationLink}`
      );
    } catch (mailError) {
      console.error('Mail sending failed:', mailError);
      // не кидаємо ApiError далі — реєстрація вже відбулась
    }
    const createdUser = newUser.rows[0];

    // for getting data which send to token after decode them
    const userDtoInstance = new UserDto(createdUser)
    const tokens = tokenService.generateTokens({...userDtoInstance})
    await tokenService.saveToken(userDtoInstance.id, tokens.refreshToken)
    return {
      ...tokens,
      user_info: newUser.rows
    }
  }

  // must be ApiError.UnauthorizedError()
  async singIn(body) {
    const {email, password} = body;
    const currentUser = await db.query(
        `SELECT *
         FROM users
         WHERE email = $1`, [email]
    )
    if (!currentUser.rows.length) {
      throw ApiError.BadRequest('User not found')
    }

    const createdUser = currentUser.rows[0];

    const validPassword = bcrypt.compareSync(password, createdUser.password_hash);
    if (!validPassword) {
      throw ApiError.BadRequest('Password not valid')
    }

    // for getting data which send to token after decode them
    const userDtoInstance = new UserDto(createdUser)
    const tokens = tokenService.generateTokens({...userDtoInstance})
    await tokenService.saveToken(createdUser.id, tokens.refreshToken)
    return {
      ...tokens,
      user_info: currentUser.rows
    }
  }

  async activationLink(link) {
    const updatedUser = await db.query(
        `UPDATE users
         SET is_activated = true
         WHERE activation_link = $1 RETURNING *`,
        [link]
    );

    if (!updatedUser.rows.length) {
      throw ApiError.BadRequest('Not correct activation link');
    }

    return updatedUser.rows[0];
  }

  async logout(refreshToken) {
    return await tokenService.removeToken(refreshToken)
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);

    const tokenFromDb = await db.query(
        `SELECT *
     FROM tokens
     WHERE refresh_token = $1`,
        [refreshToken]
    );

    if (!userData || !tokenFromDb.rows.length) {
      throw ApiError.UnauthorizedError();
    }

    if (!userData.id) {
      throw ApiError.UnauthorizedError();
    }

    const userResult = await db.query(
        `SELECT *
     FROM users
     WHERE id = $1`,
        [userData.id]
    );

    if (!userResult.rows.length) {
      throw ApiError.UnauthorizedError();
    }

    const currentUser = userResult.rows[0];

    const userDtoInstance = new UserDto(currentUser);

    const tokens = tokenService.generateTokens({...userDtoInstance});

    await tokenService.saveToken(
        userDtoInstance.id,
        tokens.refreshToken
    );

    return {
      ...tokens,
      user_info: currentUser
    };
  }

  async update(body) {
    if (!body.id) {
      throw ApiError.BadRequest('Not exist id')
    }
    const {id, name, email, password, position} = body;
    const user = await db.query(
        `UPDATE users
         set name     = $1,
             email    = $2,
             password = $3,
             position = $4
         WHERE id = $5 RETURNING *`,
        [name, email, password, position, id]
    )

    return user.rows
  }

  async delete(body) {
    if (!body.id) {
      throw ApiError.BadRequest('Not exist id')
    }
    const user = await db.query(
        `DELETE
         FROM users
         where id = $1`,
        [body.id]
    )
    return body.id
  }
}

module.exports = new UserService()
