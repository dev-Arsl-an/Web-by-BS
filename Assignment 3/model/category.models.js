const mongoose = require("mongoose");

let categorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    source: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true }, // Store the selected category
});

let Category = mongoose.model("Categories", categorySchema);
module.exports = Category;
