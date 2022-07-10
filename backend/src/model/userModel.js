const db = require("../utils/db");
const bcrypt = require("bcrypt");
const ApiError = require("../error/ApiError");
const tokenModel = require("./tokenModel");

class UserModel {
  #fileds = {
    id: "id",
    login: "login",
    name: "name",
    role: "role",
    status: "status",
  };

  async registration(login, password, name = "", role = "USER") {
    const candidate = await this.getUserByLogin(login, { id: "id" });
    if (candidate) {
      throw ApiError.badRequest(`User ${login} already exists`);
    }

    const [userData] = await db
      .insert({
        login,
        password: await bcrypt.hash(password, 8),
        name,
        role,
        status: "ACTIVE",
      })
      .into("user")
      .returning({
        id: "id",
        login: "login",
        name: "name",
        role: "role",
        status: "status",
      });
    const tokens = tokenModel.generateTokens(userData);
    tokenModel.saveTokens(userData.id, tokens.refreshToken);
    return { ...tokens, user: userData };
  }

  async login(login, password) {
    const user = await this.getUserByLogin(login, {
      id: "id",
      login: "login",
      name: "name",
      password: "password",
      role: "role",
      status: "status",
    });
    if (!user) {
      throw ApiError.badRequest(`User ${login} does not exist`);
    }
    if (user.status === "BLOCKED") {
      throw ApiError.badRequest(`User ${login} is blocked`);
    }
    const isPasswordEquals = await bcrypt.compare(password, user.password);
    if (!isPasswordEquals) {
      throw ApiError.badRequest("Password is incorrect");
    }
    const userData = {
      id: user.id,
      login: user.login,
      name: user.name,
      role: user.role,
    };
    const tokens = tokenModel.generateTokens(userData);
    tokenModel.saveTokens(userData.id, tokens.refreshToken);
    return { ...tokens, user: userData };
  }

  async refresh(refreshToken) {
    const tokenData = await tokenModel.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenModel.findToken(refreshToken);
    if (!tokenData || !tokenFromDb) {
      throw ApiError.badRequest();
    }
    const userData = await this.getUserById(tokenData.id, {
      id: "id",
      login: "login",
      name: "name",
      role: "role",
    });
    const tokens = tokenModel.generateTokens(userData);
    tokenModel.saveTokens(userData.id, tokens.refreshToken);
    return { ...tokens, user: userData };
  }

  /**
   * Получение списка всех пользователей
   * @param {?Object} fields
   * @returns {import("knex").Knex.QueryBuilder<*. *>}
   */
  getAllUsers = (fields = this.#fileds) => {
    return db.select(fields).from("user").orderBy("id");
  };

  /**
   * Получение пользователя по id
   * @param {int} userLogin
   * @param {?Object} fields
   * @returns {import("knex").Knex.QueryBuilder<*. *>}
   */
  getUserById = (userId, fields = this.#fileds) => {
    return db.first(fields).from("user").where({ id: userId });
  };

  /**
   * Получение пользователя по логину
   * @param {string} userLogin
   * @param {?Object} fields
   * @returns {import("knex").Knex.QueryBuilder<*. *>}
   */
  getUserByLogin = (userLogin, fields = this.#fileds) => {
    return db.first(fields).from("user").where({ login: userLogin });
  };

  /**
   * Обновление данных пользоателя
   * @param {int} userId
   * @param {Object} updatedParams
   * @returns {Promise<Object>}
   */
  updateUser = async (userId, { login, password, name, role, status }) => {
    const [user] = await db
      .update({
        updated_at: new Date().toISOString(),
        ...(login ? { login } : {}),
        ...(password ? { password: await bcrypt.hash(password, 8) } : {}),
        ...(name ? { name } : {}),
        ...(role ? { role } : {}),
        ...(status ? { status } : {}),
      })
      .table("user")
      .where({ id: userId })
      .returning(this.#fileds);
    return user;
  };
}

module.exports = new UserModel();
