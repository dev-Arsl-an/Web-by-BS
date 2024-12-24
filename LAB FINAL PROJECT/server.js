const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
const session = require("express-session");
const bodyParser = require('body-parser');
const jspdf = require("jspdf")
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require("path");
const mongoose = require("mongoose");



const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// Set up session
app.use(
    session({
        secret: '752386eb6cbhwlfoc8o7yn45nf34y8xf78y3y5g78ny378y3xy8825028n',
        resave: false,
        saveUninitialized: true,
        name: 'ARSLAN',
        cookie: {
            maxAge: 1800000
        },
    })
);


// Set up static files
app.use(express.static("public"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set EJS as view engine and enable layouts
app.set("view engine", "ejs");
app.use(expressEjsLayouts);

// Parse incoming form data
app.use(express.urlencoded({ extended: true }));

// Generate PDF for order confirmation
app.get('/generate-pdf', async (req, res) => {
    try {
        const order = req.session.order || {};
        const cartItems = req.session.cart || [];

        // Calculate totals from cart items
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 10; // Set default shipping or get from order if available
        const taxRate = 0.10; // 10% tax rate
        const tax = subtotal * taxRate;
        const total = subtotal + shipping + tax;

        // Create a new PDF document
        const doc = new PDFDocument({
            size: 'A4',
            margins: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50
            }
        });

        // Pipe the PDF directly to the response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=order-confirmation.pdf');
        doc.pipe(res);

        // Add decorative header
        doc.rect(50, 50, 495, 60)
           .fillAndStroke('#f0f0f0', '#cccccc');
        
        doc.fontSize(24)
           .fillColor('#333333')
           .text('SAPPHIRE', 270, 65, { align: 'center' });
        
        doc.fontSize(16)
           .fillColor('#666666')
           .text('Order Confirmation', 270, 90, { align: 'center' });

        // Add order reference number
        doc.fontSize(10)
           .fillColor('#888888')
           .text(`Order Date: ${new Date().toLocaleDateString()}`, 50, 130)
           .text(`Order Reference: #${Math.random().toString(36).substring(2, 8).toUpperCase()}`, 400, 130);

        // Customer Details Section
        doc.rect(50, 160, 495, 100)
           .fillAndStroke('#f9f9f9', '#cccccc');

        doc.fontSize(12)
           .fillColor('#333333');

        // Left column - Customer Details
        doc.text('Customer Details:', 60, 170);
        doc.fontSize(10)
           .fillColor('#666666')
           .text(`Name: ${order.firstName || 'N/A'} ${order.lastName || ''}`, 60, 190)
           .text(`Email: ${order.email || 'N/A'}`, 60, 210)
           .text(`Phone: ${order.phone || 'N/A'}`, 60, 230);

        // Right column - Shipping Details
        doc.fontSize(12)
           .fillColor('#333333')
           .text('Shipping Address:', 290, 170);
        doc.fontSize(10)
           .fillColor('#666666')
           .text(`${order.address || 'N/A'}`, 290, 190)
           .text(`${order.city || 'N/A'}, ${order.state || 'N/A'}`, 290, 210)
           .text(`${order.zipCode || 'N/A'}`, 290, 230);

        // Order Summary Section
        doc.rect(50, 280, 495, 200)
           .fillAndStroke('#f9f9f9', '#cccccc');

        // Table Header
        doc.fillColor('#333333')
           .fontSize(12)
           .text('Order Summary:', 60, 290);

        const tableTop = 320;
        doc.fontSize(10)
           .fillColor('#666666');

        // Table Headers
        doc.text('Item', 60, tableTop)
           .text('Quantity', 300, tableTop)
           .text('Price', 400, tableTop)
           .text('Total', 480, tableTop);

        // Horizontal line after headers
        doc.moveTo(60, tableTop + 15)
           .lineTo(530, tableTop + 15)
           .stroke('#cccccc');

        // Table Contents
        let yPosition = tableTop + 30;

        cartItems.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            
            doc.text(item.title || 'Product', 60, yPosition)
               .text(item.quantity.toString(), 300, yPosition)
               .text(`$${item.price.toFixed(2)}`, 400, yPosition)
               .text(`$${itemTotal.toFixed(2)}`, 480, yPosition);

            yPosition += 20;
        });

        // Final Calculations
        const calculationsStart = 440;
        doc.fontSize(10)
           .text('Subtotal:', 400, calculationsStart)
           .text(`$${subtotal.toFixed(2)}`, 480, calculationsStart)
           .text('Shipping:', 400, calculationsStart + 20)
           .text(`$${shipping.toFixed(2)}`, 480, calculationsStart + 20)
           .text('Tax:', 400, calculationsStart + 40)
           .text(`$${tax.toFixed(2)}`, 480, calculationsStart + 40);

        // Total
        doc.fontSize(12)
           .fillColor('#333333')
           .text('Total:', 400, calculationsStart + 70)
           .text(`$${total.toFixed(2)}`, 480, calculationsStart + 70);

        // Footer
        doc.rect(50, 700, 495, 50)
           .fillAndStroke('#f0f0f0', '#cccccc');

        doc.fontSize(10)
           .fillColor('#666666')
           .text('Thank you for shopping with Sapphire!', 270, 715, { align: 'center' })
           .text('For any queries, please contact our customer support.', 270, 730, { align: 'center' });

        // Finalize the PDF
        doc.end();

    } catch (error) {
        console.error('PDF Generation Error:', error);
        res.status(500).json({
            error: 'An error occurred while generating the PDF',
            details: error.message
        });
    }
});
// Routes
const productRouter = require("./routes/admin/products.router");
const loginRouter = require("./routes/pages/login.router");
const webPagesRouter = require("./routes/pages/webPages.router");
const cartRouter = require("./routes/pages/cart.router");
const orderRouter = require("./routes/pages/order.router")
app.use(orderRouter)
const wishlist = require('./routes/pages/user.router')
app.use(wishlist)
// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/sapphire").then(() => {
    console.log("Connected to MongoDB");
}).catch(() => {
    console.error("Error connecting to MongoDB");
});

// Public Routes
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/contact-us", (req, res) => {
    res.render("contact-us");
});

// Route Middlewares
app.use(loginRouter); // Login and signup pages
app.use(webPagesRouter); // Other general pages
app.use(cartRouter); // Cart functionality

// Protected Routes
app.use(productRouter); // Product-related routes (already protected by auth middleware)

// Start Server
app.listen(5001, () => {
    console.log("Server started successfully on port 5001");
});
