const { Router } = require("express");
const auth = require("../middleware/authMiddleware");

const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const boardRouter = require("./boardRouter");
const cardRouter = require("./cardRouter");

const router = Router();

const authenticate = auth.authenticate("jwt", { session: false }, null);

router.use("/auth", authRouter);
router.use("/users", authenticate, userRouter);
router.use("/boards", authenticate, boardRouter);
router.use("/cards", authenticate, cardRouter);

module.exports = router;
