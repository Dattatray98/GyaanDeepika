const bcrypt = require('bcryptjs');
const { generateToken } = require('../Service/auth');
const User = require('../models/user');

const saltRounds = 10;

async function handleusersignup(req, res) {
  try {
    const { firstName, lastName, email, mobile, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
    });

    const token = generateToken(newUser);

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.firstName,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Error registering user",
    });
  }
}

async function handleuserlogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.firstName,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Error logging in user",
    });
  }
}

async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password -googleId');
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
}



// GET: Fetch all signed users
const getAllSignedUsers = async (req, res) => {
  try {
    const users = await User.find(); // Get all users from DB
    res.status(200).json(users);     // Send user list in response
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Failed to fetch users from the database.' });
  }
};
module.exports = {
  handleusersignup,
  handleuserlogin,
  getCurrentUser,
  getAllSignedUsers
};