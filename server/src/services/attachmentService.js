const db = require('../config/db')
const ApiError = require('../exceptions/api-error')

class AttachmentsService {
  async getAll() {
    const data = await db.query(
        `SELECT *
         FROM attachments;`
    );

    return data.rows
  }

  async getById(id) {
    const data = await db.query(
        `SELECT * FROM attachments where id = $1`,
        [id]
    );
    return data.rows
  }

  async create(body, files) {
    const { task_id, uploaded_by } = body;

    if (!files || files.length === 0) {
      return [];
    }

    const attachments = await Promise.all(
        files.map(async (fileItem) => {
          const result = await db.query(
              `INSERT INTO attachments (
          task_id,
          uploaded_by,
          file_name,
          file_url,
          file_size
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
              [
                task_id,
                uploaded_by,
                fileItem.originalname,
                fileItem.path,
                fileItem.size
              ]
          );

          return result.rows[0];
        })
    );

    return attachments;
  }

  async delete(body) {
    if (!body.id) {
      throw ApiError.BadRequest('Not exist id')
    }
    const user = await db.query(
        `DELETE FROM attachments where id = $1`,
        [body.id]
    )
    return body.id
  }
}

module.exports = new AttachmentsService()
