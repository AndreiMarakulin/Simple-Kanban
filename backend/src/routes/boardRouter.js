const { Router } = require("express");
const boardController = require("../controllers/boardController");

const router = Router();

router.post("/", boardController.create);
router.get("/", boardController.getAll);
router.get("/:boardId/users", boardController.getBoardUsers);
router.get("/:boardId", boardController.getOne);
router.put("/:boardId/addUser", boardController.addBoardUser);
router.put("/:boardId", boardController.updateBoard);
router.delete("/:boardId", boardController.deleteBoard);

module.exports = router;
