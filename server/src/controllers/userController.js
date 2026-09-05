const userService = require('../services/userService')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')

class UserController {
  async getAll(req, res, next) {
    try {
      const users = await userService.getAll()
      res.status(200).json(users)
    } catch (e) {
      next(e)
    }
  }

  async getOne(req, res, next) {
    try {
      const userById = await userService.getById(req.params.id)
      res.status(200).json(userById)
    } catch (e) {
      next(e)
    }
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Error validation', errors.array()))
      }
      const response = await userService.singIn(req.body)
      res.cookie('refreshToken', response.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      res.status(201).json(response)
    } catch (e) {
      next(e)
    }
  }

  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Error validation', errors.array()))
      }
      const userCreated = await userService.signUp(req.body)
      res.cookie('refreshToken', userCreated.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      res.status(201).json(userCreated)
    } catch (e) {
      next(e)
    }
  }

  async update(req, res, next) {
    try {
      const usersUpdated = await userService.update(req.body)
      res.status(201).json(usersUpdated)
    } catch (e) {
      next(e)
    }
  }

  async delete(req, res, next) {
    try {
      const usersDeleted = await userService.delete(req.body)
      res.status(201).json(usersDeleted)
    } catch (e) {
      next(e)
    }
  }

  async logout(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const token = await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
      res.json(token)
    } catch (e) {
      next(e)
    }
  }

  async activeLink(req, res, next) {
    try {
      await userService.activationLink(req.params.link)
      res.redirect(process.env.CLIENT_URL)
    } catch (e) {
      next(e)
    }
  }

  async refresh(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const response = await userService.refresh(refreshToken)
      res.cookie('refreshToken', response.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      res.status(201).json(response)
    } catch (e) {
      next(e)
    }
  }

}

module.exports = new UserController();
