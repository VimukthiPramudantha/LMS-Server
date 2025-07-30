const express = require("express");

const router = express.Router();
const {
   createAccountant,
   getAllAccountants,
   getAccountantById,
   updateAccountant,
   deleteAccountant,
   accountantLogin,
} = require("../controller/AccountantHeadController");

// Route to create a new Accountant
router.post("/", createAccountant);

// Route to get all Accountants
router.get("/", getAllAccountants);

// Route to get all Accountants
router.post("/login", accountantLogin);

// Route to get a single Accountant by ID
router.get("/:id", getAccountantById);

// Route to update an Accountant
router.put("/:id", updateAccountant);

// Route to delete an Accountant
router.delete("/:id", deleteAccountant);
// teat routes
router.get("/test", (req, res) => {
   res.send("Accountant route is working");
});

module.exports = router;