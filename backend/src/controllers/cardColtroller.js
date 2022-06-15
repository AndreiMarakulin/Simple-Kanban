const ApiError = require("../error/ApiError");
const cardModel = require("../model/cardModel");
const userModel = require("../model/userModel");

class CardCotroller {
  /**
   * Создание карточки
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @return {Promise<void>}
   */
  async create(req, res, next) {
    const { title, description, boardId, authorId, listId, categoryId, deadline } =
      req.body;
    try {
      if (!title || !authorId) {
        return next(ApiError.badRequest(`Title or authorId does not provided`));
      }
      const author = await userModel.getUserById(authorId, { id: "id" });
      if (!author) {
        return next(
          ApiError.badRequest(`Author with id ${authorId} does not exist`)
        );
      }
      // TODO check if list with listId exists
      // TODO check if board with boardId exists
      // TODO check if category with categoryId exists
      const data = await cardModel.create(
        title,
        description,
        boardId,
        authorId,
        listId,
        categoryId,
        deadline
      );
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Получение всех карточек
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @return {Promise<void>}
   */
  async getAll(req, res, next) {
    const { listId, boardId } = req.query;
    try {
      // TODO check if list with listId exists
      const data = await cardModel.get(listId, boardId);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Получение карточки по id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @return {Promise<void>}
   */
  async getOneById(req, res, next) {
    const { cardId } = req.params;
    try {
      const data = await cardModel.findById(cardId);
      if (!data) {
        return next(
          ApiError.badRequest(`Card with id ${cardId} does not exist`)
        );
      }
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Обновление карточки по id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @return {Promise<void>}
   */
  async update(req, res, next) {
    const { cardId } = req.params;
    const { title, description, listId, categoryId, deadline } = req.body;
    try {
      const card = await cardModel.findById(cardId, {id: "c.id"})
      if (!card) {
        return next(
          ApiError.badRequest(`Card with id ${cardId} does not exist`)
        )
      }
      // TODO check if list with listId exists
      // TODO check if category with categoryId exists
      const data = await cardModel.update(cardId, {
        title,
        description,
        listId,
        categoryId,
        deadline,
      });
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Удаление карточки по id
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @return {Promise<void>}
   */
  async delete(req, res, next) {}
}

module.exports = new CardCotroller();
