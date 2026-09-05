const projectService = require('../services/projectService')

class ProjectController {
  async getAll(req, res, next) {
    try {
      const users = await projectService.getAll()
      res.status(200).json(users)
    } catch (e) {
      next(e)
    }
  }

  async getOne(req, res, next) {
    try {
      const userById = await projectService.getById(req.params.id)
      res.status(200).json(userById)
    } catch (e) {
      next(e)
    }
  }

  async create(req, res, next) {
    try {
      const usersCreated = await projectService.create(req.body)
      res.status(201).json(usersCreated)
    } catch (e) {
      next(e)
    }
  }

  async update(req, res, next) {
    try {
      const usersUpdated = await projectService.update(req.body)
      res.status(201).json(usersUpdated)
    } catch (e) {
      next(e)
    }
  }

  async delete(req, res, next) {
    try {
      const usersDeleted = await projectService.delete(req.body)
      res.status(201).json(usersDeleted)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new ProjectController();
