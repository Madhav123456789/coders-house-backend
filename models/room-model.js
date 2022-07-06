const mongoose = require("mongoose");
const STATES = require("../static/STATES");
const Schema = mongoose.Schema;

const RoomSchema = new Schema(
  {
    title: {
      type: String,
      minlength: [10, "Title should be greater than 10 characters"],
      maxlength: [200, "Title should be less than 200 characters"],
      required: [true, "Title is required"],
    },
    type: {
      type: String,
      enum: ["open", "protected", "private"],
      required: true,
      validate: (value) => {
        if (!["open", "protected", "private"].includes(value)) {
          throw new Error("Invalid room type");
        }
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Useraccount",
    },
    speakers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Useraccount",
      },
    ],
    all_members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Useraccount",
      },
    ],

    date: {
      type: Date,
      default: Date.now,
    },

    category: {
      type: String,
      enum: STATES.category_enum_array,
      default:"Others",
      validate: (value) => {
        if (!STATES.category_enum_array.includes(value)) {
          throw new Error("Your selected category haven't listed yet");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

// creating model
module.exports = mongoose.model("Room", RoomSchema);
