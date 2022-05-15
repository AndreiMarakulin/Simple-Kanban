const db = require("../utils/db");

class UserModel {
  #fileds = {
    id: 'id',
    login: 'login',
    password: 'password',
    name: "name",
    role: 'role',
    created_at: 'created_at',
    updated_at: 'updated_at',
  };

  getAllUsers(fields = this.#fileds) {
    return db.select(fields).from("user")
  };

  getUserByLogin(userLogin, fields = this.#fileds) {
    return db.first(fields).from("user").where({ login: userLogin });
  }

  getUserById(userId, fields = this.#fileds) {
    return db.first(fields).from("user").where({ id: userId });
  }
}

module.exports = new UserModel();
