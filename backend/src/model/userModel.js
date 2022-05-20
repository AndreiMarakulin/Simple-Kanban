const db = require("../utils/db");
const bcrypt = require("bcrypt");

class UserModel {
  #fileds = {
    id: "id",
    login: "login",
    name: "name",
    role: "role",
    created_at: "created_at",
    updated_at: "updated_at",
  };

  /**
   * Создание пользователя
   * @param {string} login
   * @param {string} password
   * @param {?string} name
   * @param {?string} role
   * @returns {Promise<Object>}
   */
  createUser = async (login, password, name = "", role = "USER") => {
    const [user] = await db
      .insert({
        login,
        password: await bcrypt.hash(password, 8),
        name,
        role,
      })
      .into("user")
      .returning(this.#fileds);
    return user;
  };

  /**
   * Получение списка всех пользователей
   * @param {?Object} fields
   * @returns {import("knex").Knex.QueryBuilder<*. *>}
   */
  getAllUsers = (fields = this.#fileds) => {
    return db.select(fields).from("user");
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
  updateUser = async(userId, { login, password, name, role }) => {
    const [user] = await db
    .update({
      updated_at: new Date().toISOString(),
      ...(login ? { login } : {}),
      ...(password ? {password: await bcrypt.hash(password, 8)}  : {}),
      ...(name ? { name } : {}),
      ...(role ? { role } : {}),
    })
    .table("user")
    .where({ id: userId })
    .returning(this.#fileds);
  return user;
  };
}

module.exports = new UserModel();
