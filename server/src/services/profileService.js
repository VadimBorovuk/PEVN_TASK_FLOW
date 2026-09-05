const db = require('../config/db')
const ApiError = require('../exceptions/api-error')

class ProfileService {
  async getAll() {
    const getAllRows = await db.query(
        `SELECT *
         FROM profiles`
    );

    return getAllRows.rows
  }

  async getInfoOwner (){
    const infoRows = await db.query(
        `
            SELECT CONCAT(u.name, '-', u.position) AS owner_info, pj.title, pr.github_url
            FROM users u
                     JOIN projects pj on u.id = pj.owner_id
                     JOIN profiles pr on u.id = pr.user_id
        `
    )

    return infoRows.rows
  }

  async getById(id) {
    const findProjectById = await db.query(
        `SELECT *
         FROM profiles
         where id = $1`,
        [id]
    );

    return findProjectById.rows
  }

  async create(body, file) {
    const {user_id, bio, github_url} = body;

    const newProfile = await db.query(
        `INSERT INTO profiles (user_id, avatar_url, bio, github_url)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [user_id, file.path, bio, github_url]
    );
    return newProfile.rows
  }

  async update(body) {
    if (!body.id) {
      throw ApiError.BadRequest('Not exist id')
    }
    const {id, title, description} = body;
    const profile = await db.query(
        `UPDATE profiles
         set title       = $1,
             description = $2
         WHERE id = $3 RETURNING *`,
        [title, description, id]
    )

    return profile.rows
  }

  async delete(body) {
    if (!body.id) {
      throw ApiError.BadRequest('Not exist id')
    }
    const profile
        = await db.query(
        `DELETE
         FROM profiles
         where id = $1`,
        [body.id]
    )
    return body.id
  }
}

module.exports = new ProfileService()
