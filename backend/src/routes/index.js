const { Router } = require("express");
const authRouter = require("./authRouter")
const userRouter = require("./userRouter")
const boardRouter = require("./boardRouter")
const cardRouter = require("./cardRouter")

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/boards", boardRouter);
router.use("/cards", cardRouter);

module.exports = router;
