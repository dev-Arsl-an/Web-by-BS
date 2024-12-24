const express = require("express");
const cart = express.Router(); // Using 'cart' instead of 'router'
const Product = require("../../model/products.models"); // Adjust path if needed

// Middleware to initialize the cart in session
cart.use((req, res, next) => {
  if (!req.session.cart) req.session.cart = [];
  next();
});

// Add to Cart Route
cart.get("/add-to-cart/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) return res.status(404).send("Product not found");

    // Check if product already exists in the cart
    const cartItem = req.session.cart.find(item => item.productId === productId);

    if (cartItem) {
      cartItem.quantity += 1; // Increment quantity if already in cart
    } else {
      req.session.cart.push({
        productId: productId,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    res.redirect("/cart"); // Redirect to the cart page
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//Update Quantity 
// Update Cart Quantity
cart.post("/update-cart-quantity", (req, res) => {
    const { productId, quantity } = req.body;
  
    // Ensure quantity is a valid number
    const updatedQuantity = parseInt(quantity, 10);
    if (isNaN(updatedQuantity) || updatedQuantity < 1) {
      return res.status(400).send("Invalid quantity");
    }
  
    // Find the cart item and update its quantity
    const cartItem = req.session.cart.find(item => item.productId === productId);
  
    if (cartItem) {
      cartItem.quantity = updatedQuantity;
      return res.redirect("/cart"); // Redirect back to the cart page
    }
  
    return res.status(404).send("Product not found in cart");
  });
  
// View Cart
cart.get("/", (req, res) => {
  const cartItems = req.session.cart || [];
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.render("/cart", { layout: "layout", cart: cartItems, total });
});

// Remove Item from Cart
cart.get("/cart/remove-from-cart/:id", (req, res) => {
  const productId = req.params.id;
  req.session.cart = req.session.cart.filter(item => item.productId !== productId);
  res.redirect("/cart");
});

// Clear the Cart
cart.get("/clear-cart", (req, res) => {
  req.session.cart = [];
  res.redirect("/cart");
});

// View Cart
cart.get("/cart", (req, res) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
    res.render("webPages/cart", {cart, total });
  });
  
module.exports = cart;
