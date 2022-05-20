const ApiError = require("../error/ApiError");
const boardModel = require("../model/boardModel");
const userModel = require("../model/userModel");

class BoardController {
  /**
   * Создание канбан-доски
   * @type {import('express').RequestHandler}
   */
  async create(req, res, next) {
    try {
      const { title, description = "", owner_id } = req.body;
      const owner = await userModel.getUserById(owner_id, { id: "id" });
      if (!owner) {
        return next(ApiError.badRequest("Owner does not exist"));
      }
      const data = await boardModel.create(title, description, owner_id);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Получение канбан-досок
   * @type {import('express').RequestHandler}
   */
  async getAll(req, res, next) {
    const { user_id } = req.query;
    if (user_id) {
      // if (!Number.isInteger(user_id)) {
      //   next(ApiError.badRequest(`User with id ${user_id} does not exist`));
      // }
      const user = await userModel.getUserById(user_id, { id: "id" });
      if (!user) {
        return next(
          ApiError.badRequest(`User with id ${user_id} does not exist`)
        );
      }
    }
    try {
      const data = await boardModel.getAll(user_id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Получение канбан-доски по id
   * @type {import('express').RequestHandler}
   */
  async getOne(req, res, next) {
    try {
      const { boardId } = req.params;
      const data = await boardModel.getOne(boardId);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Обновление информации о канбан-доске
   * @type {import('express').RequestHandler}
   */
  async updateBoard(req, res, next) {
    const { boardId } = req.params;

    if (
      Object.keys(req.body).some(
        (key) => !["title", "description", "owner_id"].includes(key)
      )
    ) {
      return next(ApiError.badRequest(`Unexpected param!`));
    }

    try {
      if (req.body?.owner_id) {
        const owner = await userModel.getUserById(req.body.owner_id, {
          id: "id",
        });
        if (!owner) {
          return next(
            ApiError.badRequest(
              `Owner with id ${req.body.owner_id}  does not exist`
            )
          );
        }
      }

      const board = await boardModel.getOne(boardId);
      if (!board) {
        return next(
          ApiError.badRequest(`Board with id ${boardId} does not exist`)
        );
      }

      const newData = await boardModel.updateBoard(boardId, req.body);
      res.json(newData);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Получение участников канбан-доски
   * @type {import('express').RequestHandler}
   */
  async getBoardUsers(req, res, next) {
    try {
      const { boardId } = req.params;
      const data = await boardModel.getUsersByBoardId(boardId);
      res.json(data);
    } catch {
      next(err);
    }
  }


  /**
   * Добавление пользователя к канбан-доске
   * @type {import('express').RequestHandler}
   */
  async addBoardUser(req, res, next) {
    try {
      const { boardId } = req.params;
      const board = await boardModel.getOne(boardId);
      if (!board) {
        return next(
          ApiError.badRequest(`Board with id ${boardId} does not exist`)
        );
      }

      const { userId } = req.body;
      if (!userId) {
        return next(ApiError.badRequest(`User does not given`));
      }
      const user = await userModel.getUserById(userId, {
        id: "id",
      });
      if (!user) {
        return next(
          ApiError.badRequest(`User with id ${userId}  does not exist`)
        );
      }
      await boardModel.addUserToBoard(userId, boardId);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BoardController();
