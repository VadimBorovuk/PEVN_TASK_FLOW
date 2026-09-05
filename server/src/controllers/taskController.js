const taskService = require('../services/taskService')

class TaskController {
  async getAll(req, res, next) {
    try {
      const response = await taskService.getAll()
      res.status(200).json(response)
    } catch (e) {
      next(e)
    }
  }

  async getOne(req, res, next) {
    try {
      const response = await taskService.getById(req.params.id)
      res.status(200).json(response)
    } catch (e) {
      next(e)
    }
  }

  async create(req, res, next) {
    try {
      const response = await taskService.create(req.body, req.files)
      res.status(201).json(response)
    } catch (e) {
      next(e)
    }
  }

  async update(req, res, next) {
    try {
      const response = await taskService.update(req.body)
      res.status(201).json(response)
    } catch (e) {
      next(e)
    }
  }

  async delete(req, res, next) {
    try {
      const response = await taskService.delete(req.body)
      res.status(201).json(response)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new TaskController();
