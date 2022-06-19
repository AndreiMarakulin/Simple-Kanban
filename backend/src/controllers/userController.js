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
      res.clearCookie("refreshToken");
      return res.status(200).send();
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw ApiError.badRequest("User does not login");
      }
      const userData = await userModel.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
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
    const { login, password, name, role } = req.body;
    try {
      const userWithLogin = await userModel.getUserByLogin(login, { id: "id" });
      if (userWithLogin) {
        return next(ApiError.badRequest(`User ${login} already exists`));
      }
      const user = await userModel.updateUser(userId, {
        login,
        password,
        name,
        role,
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
