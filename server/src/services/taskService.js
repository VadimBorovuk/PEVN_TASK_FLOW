const db = require('../config/db')
const ApiError = require('../exceptions/api-error')

class TaskService {
  async getAll() {
    const getAllRows = await db.query(
        `SELECT *
         FROM tasks;`
    );

    return getAllRows.rows
  }

  async getById(id) {
    const findUserById = await db.query(
        `SELECT * FROM tasks where id = $1`,
        [id]
    );
    return findUserById.rows
  }

  async create(body) {
    const {
      title,
      sub_title,
      description,
      priority,
      status,
      owner_id,
      reporter_id,
      qa_assignee_id,
      project_id,
      tag_id
    } = body;

    const newTask = await db.query(
        `INSERT INTO tasks (
            title,
            sub_title,
            description,
            priority,
            status,
            owner_id,
            reporter_id,
            qa_assignee_id,
            project_id,
            tag_id
        )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
        [
          title,
          sub_title,
          description,
          priority,
          status,
          owner_id,
          reporter_id,
          qa_assignee_id,
          project_id,
          tag_id
        ]
    );

    return newTask.rows;
  }

  async update(body) {
    if (!body.id) {
      throw ApiError.BadRequest('not exist id')
    }
    const {
      id,
      title,
      sub_title,
      description,
      priority,
      status,
      owner_id,
      reporter_id,
      qa_assignee_id,
      project_id,
      tag_id
    } = body;
    const user = await db.query(
        `UPDATE tasks 
                set title = $1,
                    sub_title = $2,
                    description = $3,
                    priority = $4,
                    status = $5,
                    owner_id = $6,
                    reporter_id = $7,
                    qa_assignee_id = $8,
                    project_id = $9,
                    tag_id = $10
         where id = $11 RETURNING *`,
        [ title,
          sub_title,
          description,
          priority,
          status,
          owner_id,
          reporter_id,
          qa_assignee_id,
          project_id,
          tag_id,
          id]
    )

    return user.rows
  }

  async delete(body) {
    if (!body.id) {
      throw ApiError.BadRequest('not exist id')
    }
    const user = await db.query(
        `DELETE FROM tasks where id = $1`,
        [body.id]
    )
    return body.id
  }
}

module.exports = new TaskService()
