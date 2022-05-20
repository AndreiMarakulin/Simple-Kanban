const { Router } = require("express");
const userController = require("../controllers/userController");

const router = Router();

router.post("/registartion", userController.create);
router.post("/login", );
router.post("/auth", );

module.exports = router;
