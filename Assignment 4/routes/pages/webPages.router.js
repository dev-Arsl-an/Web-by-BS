const express = require("express");
let webPages = express.Router();
const Product = require("../../model/products.models");

// Route to handle /collections/:category
webPages.get("/collections/:category", async (req, res) => {
    try {
        const { category } = req.params;

        // Fetch products by category from the database
        const products = await Product.find({ category });
        // Render the EJS page with fetched products
        res.render("webPages/webPage", { product: products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Server error while fetching products");
    }
});

module.exports = webPages;
