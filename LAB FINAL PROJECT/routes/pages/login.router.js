const express = require("express");
const bcrypt = require("bcrypt");
const auth = require("./auth");
const { User } = require("../../model/signup.models");
const router = express.Router();

// Login Page
router.get("/login", auth.bypassLogin, (req, res) => {
    res.render("login/login", { layout: false });
});

// Sign-Up Page
router.get("/sign-up", auth.bypassLogin, (req, res) => {
    res.render("login/login", { layout: false });
});
router.get("/sign-ups", auth.bypassLogin, (req, res) => {
    res.render("login/signup", { layout: false });
});

// Handle Login
router.post("/login", async (req, res) => {
    const { gmail, password } = req.body;

    try {
        const user = await User.findOne({ gmail });
        if (!user) {
            return res.redirect("/login");
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.redirect("/login");
        }

        req.session.user = { id: user._id, gmail: user.gmail };
        console.log("Session Created:", req.session.user);  // Check if the session is being set
        res.redirect("/admin/products");
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send("Either Gmail or Password is incorrect! Try Again");
    }
});
// Handle Sign-Up
router.post("/sign-up", async (req, res) => {
    try {
        const { firstName, secondName, gmail, password } = req.body;

        const existingUser = await User.findOne({ gmail });
        if (existingUser) {
            return res.status(400).send("User already exists! Please use a different email.");
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ firstName, secondName, gmail, password: hashedPassword });
        await newUser.save();

        res.redirect("/login");
    } catch (error) {
        console.error("Sign-Up Error:", error);
        res.status(500).send("Server Error");
    }
});

// Logout
router.get("/logout", auth.checkLoggedIn, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout Error:", err);
            return res.status(500).send("Server Error");
        }
        res.clearCookie('ARSLAN');
        res.redirect("/login");
    });
});

module.exports = router;
