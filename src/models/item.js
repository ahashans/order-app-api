const mongoose = require("mongoose");
const itemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Groups",
  },
});
itemSchema.virtual("orders", {
  ref: "Orders",
  localField: "_id",
  foreignField: "details.item",
});
itemSchema.index({ name: 1, group: 1 }, { unique: true });
const Item = mongoose.model("Items", itemSchema);
module.exports = Item;
