const express = require('express');
const nodemailer = require("nodemailer")
const Order = require('../../model/orders.models');  // Import the order model
const router = express.Router();
const session = require('express-session');
router.use(session({
    secret: 'My-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 1800000
    }
}));
const transporter = nodemailer.createTransport({
    service: 'Gmail', // or 'SMTP'
    auth: {
        user: 'arslanlatif067@gmail.com',
        pass: 'tywo kmze cbji zgjo', // Use app-specific password if needed
    },
});

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/process-checkout', (req, res) => {
    // Assuming the cart items are stored in the session or elsewhere
    const cartItems = req.session.cart || [];  // Or another source of cart items

    // Calculate subtotal (sum of all item prices * their quantities)
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Example shipping cost calculation (based on region, shipping method, etc.)
    const shipping = 10;  // Could be dynamic based on location or other factors

    // Example tax rate (10% sales tax, could be based on location)
    const taxRate = 0.10;
    const tax = subtotal * taxRate;

    // Calculate total cost (subtotal + shipping + tax)
    const total = subtotal + shipping + tax;

    // Render the checkout page and pass the necessary variables
    res.render('webPages/checkout', { subtotal, shipping, tax, total });
});

// Route to process the checkout form submission
router.post('/process-checkout', async (req, res) => {
    try {
        const {
            firstName, lastName, email, address, city, state, zipCode,
            paymentMethod, cardNumber, expirationDate, cvv,
            subtotal, shipping, tax, total
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !address || !city || !state || !zipCode || !subtotal || !total) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create a new order object
        const newOrder = new Order({
            firstName,
            lastName,
            email,
            address,
            city,
            state,
            zipCode,
            paymentMethod,
            cardDetails: paymentMethod === 'card' ? { cardNumber, expirationDate, cvv } : null,
            orderSummary: {
                subtotal: parseFloat(subtotal),
                shipping: parseFloat(shipping),
                tax: parseFloat(tax),
                total: parseFloat(total),
            },
        });

        // Save the order to the database
        await newOrder.save();
        req.session.order = newOrder;

        const mailOptions = {
            from: '"SAPPHIRE" <arslanlatif067@gmail.com>', // Replace with your email
            to: email,
            subject: 'Order Confirmation - Sapphire',
            html: `
                <h1>Thank you for your order, ${firstName} ${lastName}!</h1>
                <p>We have received your order and are processing it. Here are the details:</p>
                <p><strong>Order Total:</strong> $${total}</p>
                <p><strong>Shipping Address:</strong></p>
                <p>${address}, ${city}, ${state}, ${zipCode}</p>
                <p>If you have any questions, feel free to contact our support team.</p>
                <p>Thank you for shopping with Sapphire!</p>
            `,
        };

        try{
            await transporter.sendMail(mailOptions);
        }
        catch(emailError){
            console.error('Email Sending Error:', emailError);
    throw new Error('Failed to send confirmation email.');
        }
        res.render('webPages/confirmation',{ order: newOrder})
    } catch (error) {
        console.error('Order Processing Error:', error);
        res.status(500).json({ message: 'An error occurred while processing the order.', error });
    }
});

router.get('/confirmation', (req, res) => {
    const order = req.session.order || {};
    res.render('webPages/confirmation', { order });
});

router.get('/my-orders', async (req, res) => {
    try {
        const orders = await Order.find(); // Fetch all orders
        res.render('webPages/tracks', { orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('An error occurred while fetching orders.');
    }
});


module.exports = router;
