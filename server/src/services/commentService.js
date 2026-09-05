const db = require('../config/db')
const ApiError = require('../exceptions/api-error')

class CommentService {
  async getAll() {
    const getAllRows = await db.query(
        `SELECT *
         FROM comments;`
    );

    return getAllRows.rows
  }

  async getById(id) {
    const findUserById = await db.query(
        `SELECT * FROM comments where id = $1`,
        [id]
    );
    return findUserById.rows
  }

  async create(body) {
    const {
      task_id,
      owner_id,
      content
    } = body;

    const newComment = await db.query(
        `INSERT INTO comments (
            task_id,
            owner_id,
            content
        )
         VALUES ($1, $2, $3)
             RETURNING *`,
        [
          task_id,
          owner_id,
          content
        ]
    );

    return newComment.rows;
  }

  async update(body) {
    if (!body.id) {
      throw ApiError.BadRequest('Not exist id')
    }
    const {
      id,
      task_id,
      owner_id,
      content
    } = body;
    const user = await db.query(
        `UPDATE comments 
                set task_id = $1,
                    owner_id = $2,
                    content = $3
         where id = $4 RETURNING *`,
        [ task_id,
          owner_id,
          content,
          id]
    )

    return user.rows
  }

  async delete(body) {
    if (!body.id) {
      throw ApiError.BadRequest('Not exist id')
    }
    const user = await db.query(
        `DELETE FROM comments where id = $1`,
        [body.id]
    )
    return body.id
  }
}

module.exports = new CommentService()
