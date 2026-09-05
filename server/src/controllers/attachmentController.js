const attachmentService = require('../services/attachmentService')

class AttachmentController {
  async getAll(req, res) {
    try {
      const tasks = await attachmentService.getAll()
      res.status(200).json(tasks)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async getOne(req, res) {
    try {
      const attachmentById = await attachmentService.getById(req.params.id)
      res.status(200).json(attachmentById)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async create(req, res) {
    try {
      const attachmentCreated = await attachmentService.create(req.body, req.files)
      res.status(201).json(attachmentCreated)
    } catch (e) {
      res.status(500).json(e.message)
    }
  }

  async update(req, res) {
    try {
      const attachmentUpdated = await attachmentService.update(req.body)
      res.status(201).json(attachmentUpdated)
    } catch (e) {
      res.status(500).json(e.message)
    }
  }

  async delete(req, res) {
    try {
      const attachmentDeleted = await attachmentService.delete(req.body)
      res.status(201).json(attachmentDeleted)
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
}

module.exports = new AttachmentController();
