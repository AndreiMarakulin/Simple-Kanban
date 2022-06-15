const db = require("../utils/db");

class CardModel {
  #fileds = {
    id: "c.id",
    title: "c.title",
    authorLogin: "u.login",
    description: "c.description",
    listTitel: "l.title",
    boardId: "bc.board_id",
    categoryTitle: "cat.title",
    deadline: "c.deadline",
    createdAt: "c.created_at",
    updatedAt: "c.updated_at",
  };

  /**
   * Создание карточки
   * @param {string} title
   * @param {string} description
   * @param {int} authorId
   * @param {int} listId
   * @param {int} categoryId
   * @param {Date} deadline
   * @returns {Promise<Object>}
   */
  create = async (
    title,
    description,
    boardId,
    authorId,
    listId,
    categoryId,
    deadline
  ) => {
    const [{ id, created_at: createdAt }] = await db
      .insert({
        title,
        description,
        author_id: authorId,
        list_id: listId,
        category_id: categoryId,
        deadline,
      })
      .into({ c: "card" })
      .returning(["id", "created_at"]);

    await db
      .insert({
        card_id: id,
        board_id: boardId,
      })
      .into("board_card");
    return { id, title, createdAt };
  };

  /**
   * Получение всех карточек
   * @param {?number} listId
   * @param {?number} boardId
   * @returns {import('knex').Knex.QueryBuilder<*, *>}
   */
  get = (listId, boardId) => {
    const query = db
      .select(this.#fileds)
      .from({ c: "card" })
      .leftJoin({ u: "user" }, { "c.author_id": "u.id" })
      .leftJoin({ l: "list" }, { "c.list_id": "l.id" })
      .leftJoin({ cat: "category" }, { "c.category_id": "cat.id" })
      .leftJoin({ bc: "board_card" }, { "c.id": "bc.card_id" });
    if (listId) {
      query.where({ "c.list_id": listId });
    }
    if (boardId) {
      query.where({ "bc.board_id": boardId });
    }
    query.orderBy("id");
    return query;
  };

  /**
   * Получение карточки по id
   * @param {int} cardId
   * @param {?Object} fields
   * @returns {import('knex').Knex.QueryBuilder<*, *>}
   */
  findById = (cardId, fields = this.#fileds) => {
    const query = db
      .first(fields)
      .from({ c: "card" })
      .where({ "c.id": cardId });
    if (fields?.authorLogin) {
      query.leftJoin({ u: "user" }, { "c.author_id": "u.id" });
    }
    if (fields?.listTitel) {
      query.leftJoin({ l: "list" }, { "c.list_id": "l.id" });
    }
    if (fields?.categoryTitle) {
      query.leftJoin({ cat: "category" }, { "c.category_id": "cat.id" });
    }
    return query;
  };

  /**
   * Обновление данных в карточке по id
   * @param {int} cardId
   * @param {Object}
   * @returns {Promise<Object>}
   */
  update = async (
    cardId,
    { title, description, listId, categoryId, deadline }
  ) => {
    const [{ id, newTitle, updated_at: updatedAt }] = await db
      .update({
        updated_at: new Date().toISOString(),
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        ...(listId ? { list_id: listId } : {}),
        ...(categoryId ? { category_id: categoryId } : {}),
        ...(deadline ? { deadline } : {}),
      })
      .table({ c: "card" })
      .where({ "c.id": cardId })
      .returning(["id", "title", "updated_at"]);
    return { id, newTitle, updatedAt };
  };
}

module.exports = new CardModel();
