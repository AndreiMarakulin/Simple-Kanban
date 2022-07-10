const ApiError = require("../error/ApiError");
const tokenModel = require("../model/tokenModel");
const userModel = require("../model/userModel");

class UserController {
  async registration(req, res, next) {
    try {
      const { login, password, name, role } = req.body;
      if (!login) {
        return next(ApiError.badRequest(`Missing login!`));
      }
      if (!password) {
        return next(ApiError.badRequest(`Missing password!`));
      }
      const userData = await userModel.registration(login, password, name, role);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "Lax",
        secure: true,
      });
      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { login, password } = req.body;
      const userData = await userModel.login(login, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "Lax",
        secure: true,
      });
      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw ApiError.badRequest("User does not login");
      }
      await tokenModel.removeToken(refreshToken);
      res.clearCookie("refreshToken", {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "Lax",
        secure: true,
      });
      return res.json({}).status(200);
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.json({}).status(200);
      }
      const userData = await userModel.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "Lax",
        secure: true,
      });
      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Получение всех пользователей
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @return {Promise<void>}
   */
  getAll = async (req, res, next) => {
    try {
      const data = await userModel.getAllUsers();
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Получение пользователя по id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @return {Promise<void>}
   */
  getOneById = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const data = await userModel.getUserById(userId);
      if (!data) {
        return next(
          ApiError.badRequest(`User with id ${userId} does not exist`)
        );
      }
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Обновление данных пользователя
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @return {Promise<void>}
   */
  update = async (req, res, next) => {
    const { userId } = req.params;
    const { login, password, name, role, status } = req.body;
    try {
      const userWithId = await userModel.getUserById(userId, { id: "id" });
      if (!userWithId) {
        return next(ApiError.badRequest(`User with id ${userId} does not exist`));
      }
      const user = await userModel.updateUser(userId, {
        login,
        password,
        name,
        role,
        status,
      });
      res.json(user);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Удаление пользователя
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @return {Promise<void>}
   */
  delete = async (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new UserController();
