const Accountant = require("../model/AccountModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "test";

exports.createAccountant = async (req, res) => {
  try {
    // First destructure the values from req.body
    const { name, assignCampus, AccountantIsDirector, password, AccountID } = req.body;

    // Then check if name or AccountID already exists
    const existingAccountant = await Accountant.findOne({
      $or: [{ name }, { AccountID }],
    });

    if (existingAccountant) {
      return res.status(400).json({ message: "Name or AccountID already exists" });
    }

    const newAccountant = new Accountant({
      name,
      assignCampus,
      AccountantIsDirector,
      password,
      AccountID,
    });

    const savedAccountant = await newAccountant.save();
    res.status(201).json(savedAccountant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Accountants
exports.getAllAccountants = async (req, res) => {
  try {
    const accountants = await Accountant.find().populate("assignCampus");
    res.status(200).json(accountants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Accountant by ID
exports.getAccountantById = async (req, res) => {
  try {
    const accountant = await Accountant.findById(req.params.id).populate(
      "assignCampus"
    );
    if (!accountant) {
      return res.status(404).json({ message: "Accountant not found" });
    }
    res.status(200).json(accountant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an Accountant
exports.updateAccountant = async (req, res) => {
  try {
    const updatedAccountant = await Accountant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("assignCampus");

    if (!updatedAccountant) {
      return res.status(404).json({ message: "Accountant not found" });
    }

    res.status(200).json(updatedAccountant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an Accountant
exports.deleteAccountant = async (req, res) => {
  try {
    const deletedAccountant = await Accountant.findByIdAndDelete(req.params.id);

    if (!deletedAccountant) {
      return res.status(404).json({ message: "Accountant not found" });
    }

    res.status(200).json({ message: "Accountant deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//
exports.accountantLogin = async (req, res) => {
  const { name, password } = req.body;

  try {
    // Validate required fields
    if (!name || !password) {
      return res
        .status(400)
        .json({ message: "Accountant Name and Password are required" });
    }

    // Check if the Accountant exists
    const existingAccountant = await Accountant.findOne({ name });
    if (!existingAccountant) {
      return res.status(400).json({ message: "Accountant does not exist" });
    }

    // Check if the password is correct
    if (password !== existingAccountant.password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Ensure only coordinators with coordinatorIsDirector: true can log in
    if (!existingAccountant.AccountantIsDirector) {
      return res
        .status(403)
        .json({
          message: "Access denied get the permission from the Director ",
        });
    }
    // Generate JWT token
    const token = jwt.sign(
      {
        id: existingAccountant._id,
        name: existingAccountant.name,
        assignCampus: existingAccountant.assignCampus,
        accountID: existingAccountant.AccountID,
        role: "Accountant",
      },
      secret,
      { expiresIn: "1h" }
    );

    // Return success response
    res.status(200).json({ result: existingAccountant, token });
    console.log("Accountant  login successful:", existingAccountant);
  } catch (error) {
    // Handle validation and other errors
    console.error("Accountant  login failed:", error);
    res
      .status(500)
      .json({ message: "Accountant  login failed", error: error.message });
  }
};
