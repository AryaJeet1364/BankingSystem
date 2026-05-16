const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const transactionController = require("../controllers/transaction.controller")

const router = express.Router();


/* POST /api/transaction */
router.post("/", authMiddleware.authMiddleware, transactionController.createTransaction)


router.post("/system/initial-funds", authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransaction)


module.exports = router