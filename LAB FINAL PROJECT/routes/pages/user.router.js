const express = require("express");
const bcrypt = require("bcrypt");
const auth = require("./auth");
const Product = require('../../model/products.models');
const User  = require("../../model/user_auth.models");
const router = express.Router();
const session = require("express-session");

// Session Configuration
router.use(session({
    secret: "my-secret-key",  // Use a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set 'secure: true' if using HTTPS
}));

// Login Page
router.get("/user-login", auth.bypassLogin, (req, res) => {
    res.render("user_auth/user-login", { layout: false });
});

// Handle Login
router.post("/user-login", async (req, res) => {
    const { gmail, password } = req.body;

    try {
        const user = await User.findOne({ gmail });
        if (!user) {
            return res.redirect("/user-login");
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.redirect("/user-login");
        }

        req.session.user = { id: user._id, gmail: user.gmail };
        console.log("Session Created:", req.session.user);  // Check if the session is being set
        res.redirect("/webPages/wishlist");
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send("Either Gmail or Password is incorrect! Try Again");
    }
});

// Sign Up Page
router.get("/user-signup", auth.bypassLogin, (req, res) => {
    res.render("user_auth/user-signup", { layout: false }); // Render signup page
});

// Handle Sign-Up
router.post("/wishlist", async (req, res) => {
    try {
        const { firstName, secondName, gmail, password } = req.body;

        const existingUser = await User.findOne({ gmail });
        if (existingUser) {
            return res.status(400).send("User already exists! Please use a different email.");
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ firstName, secondName, gmail, password: hashedPassword });
        await newUser.save();

        res.redirect("/user_auth/user-login");
    } catch (error) {
        console.error("Sign-Up Error:", error);
        res.status(500).send("Server Error");
    }
});

// Protected Wishlist Route
router.get("/wishlist", auth.requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id).populate('wishlist');
        if (!user) {
            return res.redirect('/user_auth/user-login');
        }
        res.render("webPages/wishlist", { wishlist: user.wishlist || [] });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).send("Something went wrong");
    }
});

// Add to Wishlist (Protected)
router.get("/add-to-wishlist/:id", auth.requireAuth, async (req, res) => {
    try {
        const productId = req.params.id;
        const user = await User.findById(req.session.user.id);

        if (!user) {
            return res.redirect('/wishlist');
        }

        // Check if product already exists in wishlist
        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }

        res.redirect("/wishlist");
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).send("Something went wrong");
    }
});

module.exports = router;
