const profileService = require('../services/profileService')

class ProjectController {
  async getAll(req, res) {
    try {
      const profiles = await profileService.getAll()
      res.status(200).json(profiles)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async getInfoOwner(req, res) {
    try {
      const ownerInfo = await profileService.getInfoOwner()
      res.status(200).json(ownerInfo)
    } catch (e) {
      res.status(500).json(e.message)
    }
  }

  async getOne(req, res) {
    try {
      const profileById = await profileService.getById(req.params.id)
      res.status(200).json(profileById)
    } catch (e) {
      res.status(500).json(e.message)
    }
  }

  async create(req, res) {
    try {
      const profileCreated = await profileService.create(req.body, req.file)
      res.status(201).json(profileCreated)
    } catch (e) {
      res.status(500).json(e.message)
    }
  }

  async update(req, res) {
    try {
      const profileUpdated = await profileService.update(req.body)
      res.status(201).json(profileUpdated)
    } catch (e) {
      res.status(500).json(e.message)
    }
  }

  async delete(req, res) {
    try {
      const profileDeleted = await profileService.delete(req.body)
      res.status(201).json(profileDeleted)
    } catch (e) {
      res.status(500).json(e.message)
    }
  }
}

module.exports = new ProjectController();
