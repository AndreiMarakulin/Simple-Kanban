const { Router } = require("express");
const cardColtroller = require("../controllers/cardColtroller");

const router = Router();

router.post("/", cardColtroller.create);
router.get("/", cardColtroller.getAll);
router.get("/:cardId", cardColtroller.getOneById);
router.put("/:cardId", cardColtroller.update);
// router.delete("/:cardId", cardColtroller.delete);

module.exports = router;
