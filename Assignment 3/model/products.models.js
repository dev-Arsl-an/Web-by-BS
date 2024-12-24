const mongoose = require("mongoose");

let productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String},
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true }, // New field for image path
    category: { 
        type: String, 
        enum: ["MEN", "WOMEN", "KIDS", "BEAUTY", "ACCESSORIES"], 
        required: true 
    },
    isFeatured: { type: Boolean, default: false },
    
});

let Product = mongoose.model("Product", productSchema);

module.exports = Product;
