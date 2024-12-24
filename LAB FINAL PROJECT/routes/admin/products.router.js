const express = require("express");
const multer = require("multer");
const router = express.Router();
const Product = require("../../model/products.models");

// Configure Multer for File Upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage: storage });

// Middleware to check superadmin permission
router.use("/admin/*", (req, res, next) => {
    if (req.session?.isSuperadmin) {
        return next();
    }
    res.redirect("/permission"); // Redirect to permission page if not authorized
});

// Permission Page Route
router.get("/permission", (req, res) => {
    res.render("login/permission",{layout: false}); // Ensure `permission.ejs` is in the `views` folder
});

// Handle Permission Form Submission
router.post("/permission", (req, res) => {
    const SUPERADMIN_CREDENTIALS = {
        username: "superadmin",
        password: "admin123",
    };

    const { username, password } = req.body;

    if (
        username === SUPERADMIN_CREDENTIALS.username &&
        password === SUPERADMIN_CREDENTIALS.password
    ) {
        req.session.isSuperadmin = true; // Store permission in session
        res.redirect("/admin/products");
    } else {
        res.status(403).send("Access Denied: Invalid Credentials");
    }
});

// Create Product Form
router.get("/admin/products/create", (req, res) => {
    res.render("admin/product-form", { layout: "admin/admin-layout" });
});

// Create Product
router.post("/admin/products/create", upload.single("image"), async (req, res) => {
    try {
        let product = new Product(req.body);
        if (req.file) {
            product.image = `uploads/${req.file.filename}`;
        }
        product.isFeatured = Boolean(req.body.isFeatured);
        await product.save();
        res.redirect("/admin/products");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

router.get("/admin/products/:page?", async (req, res) => {
    try {
        const { search, sort } = req.query;
        const perPage = 3;
        const currentPage = parseInt(req.params.page) || 1;

        // Construct query object
        let query = {};
        if (search) {
            query.$or = [
                { title: new RegExp(search, "i") },
                { category: new RegExp(search, "i") },
            ];
        }

        // Construct sort option
        let sortOption = {};
        if (sort === "priceAsc") sortOption.price = 1;
        else if (sort === "priceDesc") sortOption.price = -1;

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / perPage);

        const products = await Product.find(query)
            .sort(sortOption)
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        const hasProducts = products.length > 0;

        // Build queryParams string
        const queryParams = Object.entries(req.query)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join("&");

        res.render("admin/products", {
            layout: "admin/admin-layout",
            products,
            currentPage,
            totalPages,
            hasProducts,
            searchQuery: search || "",
            sortOption: sort || "",
            queryParams, // Pass queryParams to the view
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Edit Product (Display Edit Form)
router.get("/admin/products/edit/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render("admin/edit-form", { layout: "admin/admin-layout", product });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Update Product
router.post("/admin/products/edit/:id", upload.single("image"), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        product.title = req.body.title;
        product.description = req.body.description;
        product.price = req.body.price;
        product.category = req.body.category;

        if (req.file) {
            product.image = `uploads/${req.file.filename}`;
        }
        product.isFeatured = Boolean(req.body.isFeatured);

        await product.save();
        res.redirect("/admin/products");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Delete Product
router.get("/admin/products/delete/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect("/admin/products");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Handle Categories
router.get("/admin/category/:category", async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        const hasProducts = products.length > 0;
        res.render("pages/CategoryPages", {
            layout: "admin/admin-layout",
            products,
            hasProducts,
            category: req.params.category,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Render Edit Category Form
router.get("/admin/edit/:id", async (req, res) => {
    try {
        const products = await Product.findById(req.params.id);
        res.render("pages/edit-category-form", { layout: "admin/admin-layout", products });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Update Category
router.post("/admin/edit/:id", upload.single("image"), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        product.title = req.body.title;
        product.description = req.body.description;
        product.price = req.body.price;
        product.category = req.body.category;

        if (req.file) {
            product.image = `uploads/${req.file.filename}`;
        }

        await product.save();
        res.redirect(`/admin/category/${product.category}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Delete from Category
router.get("/admin/delete/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        res.redirect(`/admin/category/${product.category}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
