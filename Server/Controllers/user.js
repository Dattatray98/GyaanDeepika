const express = require("express")
const User = require("../models/user.js");
const { v4: uuidv4 } = require('uuid');
const { setUser } = require("../Service/auth.js")
const cookieParser = require("cookie-parser")
var session = require('express-session')
const app = express();
app.use(cookieParser())

async function handleusersignup(req, res) {
    try {
        const { firstName, lastName, email, mobile, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            mobile,
            password, // You should hash this in production
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: newUser,
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
            success: false,
            message: "Error registering user",
        });
    }
}

// User Login function

async function handleuserlogin(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const sessionId = uuidv4();
        setUser(sessionId, user);
        res.cookie("user", sessionId);
        console.log(sessionId)


        return res.status(200).json({
            success: true,
            message: "Login successful",
            user,

        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Error logging in user",
        });
    }
}

// functions for get all users who are signed

async function GetsignedUsers(req, res) {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    handleusersignup,
    handleuserlogin,
    GetsignedUsers,
};