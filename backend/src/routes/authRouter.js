const { Router } = require("express");
const UserController = require("../controllers/userController");

const router = Router();

router.post("/registration", UserController.registration);
router.post("/login", UserController.login);
router.get('/logout', UserController.logout);
router.get("/refresh", UserController.refresh);

module.exports = router;
