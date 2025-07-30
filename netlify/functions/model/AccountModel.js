const mongoose = require("mongoose");

const AccountantSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true, // Ensures no duplication
      required: true,
    },

    assignCampus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campus",
      },
    ],
    AccountantIsDirector: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      required: true,
    },

    AccountID: {
      type: String,
    },

    role: {
      type: String,
      enum: ["Accountant"],
      default: "Accountant",
    },
  },
  {
    timestamps: true, //Automatically adds createdAt and updatedAt fields
  }
);

const Accountant = mongoose.model("Accountant", AccountantSchema);

module.exports = Accountant;
