const { Router } = require("express");
const userController = require("../controllers/userController");

const router = Router();

router.get("/", userController.getAll);
router.get("/:userId", userController.getOneById);
router.put("/:userId", userController.update);
router.delete("/:userId", userController.delete);

module.exports = router;
