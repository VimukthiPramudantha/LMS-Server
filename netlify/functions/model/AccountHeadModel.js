const mongoose = require("mongoose");

const AccountantHeadSchema = mongoose.Schema(
  {
    name: {
      type: String,
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
      default: true,
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
      enum: ["AccountantHead"],
      default: "AccountantHead",
    },
  },
  {
    timestamps: true, //Automatically adds createdAt and updatedAt fields
  }
);

const AccountantHead = mongoose.model("AccountantHead", AccountantHeadSchema);

module.exports = AccountantHead;
