const commentService = require('../services/commentService')

class CommentController {
  async getAll(req, res) {
    try {
      const tasks = await commentService.getAll()
      res.status(200).json(tasks)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async getOne(req, res) {
    try {
      const taskById = await commentService.getById(req.params.id)
      res.status(200).json(taskById)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async create(req, res) {
    try {
      const taskCreated = await commentService.create(req.body)
      res.status(201).json(taskCreated)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async update(req, res) {
    try {
      const taskUpdated = await commentService.update(req.body)
      res.status(201).json(taskUpdated)
    } catch (e) {
      res.status(500).json(e.message)
    }
  }

  async delete(req, res) {
    try {
      const taskDeleted = await commentService.delete(req.body)
      res.status(201).json(taskDeleted)
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
}

module.exports = new CommentController();
