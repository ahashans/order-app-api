const mongoose = require("mongoose");
const validator = require("validator");
const groupSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
  ],

  created_date: {
    type: Date,
    // `Date.now()` returns the current unix timestamp as a number
    default: Date.now,
  },
});
groupSchema.virtual("items", {
  ref: "Items",
  localField: "_id",
  foreignField: "group",
});
const Group = mongoose.model("Groups", groupSchema);
module.exports = Group;
