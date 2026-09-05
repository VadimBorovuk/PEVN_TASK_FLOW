const db = require('../config/db')
const ApiError = require('../exceptions/api-error')

class ProjectService {
  async getAll() {
    const getAllRows = await db.query(
        `SELECT *
         FROM projects`
    );

    return getAllRows.rows
  }

  async getById(id) {
    const findProjectById = await db.query(
        `SELECT * FROM projects where id = $1`,
        [id]
    );

    return findProjectById.rows
  }

  async create(body) {
    const {title, description, owner_id} = body
    const newProject = await db.query(
        `INSERT INTO projects (title, description, owner_id)
         VALUES ($1, $2, $3) RETURNING *`,
        [title, description, owner_id]
    );
    return newProject.rows
  }

  async update(body) {
    if (!body.id) {
      throw ApiError.BadRequest('Not exist id')
    }
    const {id, title, description} =  body;
    const project = await db.query(
        `UPDATE projects 
                set title = $1,
                    description = $2
         WHERE id = $3 RETURNING *`,
        [title, description, id]
    )

    return project.rows
  }

  async delete(body) {
    if (!body.id) {
      throw ApiError.BadRequest('Not exist id')
    }
    const project
        = await db.query(
        `DELETE FROM projects where id = $1`,
        [body.id]
    )
    return body.id
  }
}

module.exports = new ProjectService()
