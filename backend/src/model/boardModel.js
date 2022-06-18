const knex = require("knex");
const db = require("../utils/db");

class BoardModel {
  #fileds = {
    id: "b.id",
    title: "b.title",
    description: "b.description",
    owner_id: "b.owner_id",
    created_at: "b.created_at",
    updated_at: "b.updated_at",
    deleted_at: "b.deleted_at",
  };

  /**
   * Создает доску
   * @param {string} title
   * @param {string} description
   * @param {int} owner_id
   * @returns {Promise}
   */
  async create(title, description, owner_id) {
    const [board] = await db
      .insert({
        title,
        description,
        owner_id,
      })
      .into({ b: "board" })
      .returning(this.#fileds);
    this.addUserToBoard(owner_id, board.id);
    return board;
  }

  getAll(user_id = null) {
    const query = db.select(this.#fileds).from({ b: "board" });

    if (user_id) {
      query.leftJoin({ ub: "user_board" }, { "b.id": "ub.board_id" });
      query.where({ "ub.user_id": user_id });
    }
    query.whereNull("b.deleted_at");
    return query;
  }

  getOne(board_id) {
    return db.first(this.#fileds).from({ b: "board" }).where({ id: board_id });
  }

  async updateBoard(boardId, { title, description, owner_id }) {
    const [board] = await db
      .update({
        updated_at: new Date().toISOString(),
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        ...(owner_id ? { owner_id } : {}),
      })
      .table({ b: "board" })
      .where({ id: boardId })
      .returning(this.#fileds);
    return board;
  }

  async deleteBoard(boardId) {
    await db
      .update({
        deleted_at: new Date().toISOString(),
      })
      .table({ b: "board" })
      .where({ id: boardId });
    return;
  }

  getUsersByBoardId(board_id) {
    const query = db
      .select({
        user_id: "ub.user_id",
        login: "u.login",
        name: "u.name",
      })
      .from({ ub: "user_board" })
      .leftJoin({ u: "user" }, { "ub.user_id": "u.id" })
      .where({ "ub.board_id": board_id });
    return query;
  }

  async addUserToBoard(user_id, board_id) {
    await db
      .insert({
        user_id,
        board_id,
      })
      .into("user_board");
    return;
  }

  getCardOrder(boardId) {
    return db
      .select({
        id: "l.id",
        title: "l.title",
        cardOrder: "co.order",
      })
      .from({ co: "card_order" })
      .leftJoin({ l: "list" }, { "co.list_id": "l.id" })
      .where({ "co.board_id": boardId })
      .orderBy(["co.board_id", "co.list_id"]);
  }

  async addCardOrder(boardId, listId) {
    await db
      .insert({ board_id: boardId, list_id: listId, order: [] })
      .into("card_order")
    return;
  }

  async updateCardOrder(boardId, listId, cardOrder) {
    await db
      .update({
        order: cardOrder,
      })
      .table({ co: "card_order" })
      .where({ "co.board_id": boardId, "co.list_id": listId });
    return;
  }

  async appendToCardOrder(boardId, listId, cardId) {
    await db
      .update({
        order: db.raw("array_append(co.order, ?)", [cardId]),
      })
      .table({ co: "card_order" })
      .where({ "co.board_id": boardId, "co.list_id": listId });
    return;
  }
}

module.exports = new BoardModel();
