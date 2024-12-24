const mongoose = require("mongoose");

// Define the schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
        trim: true,
        minlength: [2, "First Name must be at least 2 characters"],
        maxlength: [50, "First Name cannot exceed 50 characters"]
    },
    secondName: {
        type: String,
        required: [true, "Second Name is required"],
        trim: true,
        minlength: [2, "Second Name must be at least 2 characters"],
        maxlength: [50, "Second Name cannot exceed 50 characters"]
    },
    gmail: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid Gmail address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"]
    },
}, {
    timestamps: true 
});


// Compile the schema into a model
const User = mongoose.model("UserLogins", userSchema);

module.exports = {User}

