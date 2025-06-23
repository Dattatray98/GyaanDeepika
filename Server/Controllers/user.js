const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');
const User = require('../models/user');

const saltRounds = 10;

async function handleUserSignup(req, res) {
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

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
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

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "Please login with Google",
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

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
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



async function updateUserProfile(req, res) {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email, mobile, bio } = req.body;

    const updatedFields = {};
    if (firstName) updatedFields.firstName = firstName;
    if (lastName) updatedFields.lastName = lastName;
    if (email) updatedFields.email = email;
    if (mobile) updatedFields.mobile = mobile;
    if (bio) updatedFields.bio = bio;

    // If avatar file is uploaded, upload it to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        {
          folder: 'avatars',
          resource_type: 'image',
        },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ success: false, message: "Failed to upload avatar" });
          }

          updatedFields.avatar = result.secure_url;

          const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updatedFields },
            { new: true, runValidators: true }
          ).select('-password -googleId');

          if (!updatedUser) {
            return res.status(404).json({
              success: false,
              message: "User not found"
            });
          }

          return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
          });
        }
      );

      // Pipe file buffer into Cloudinary upload stream
      require('streamifier').createReadStream(req.file.buffer).pipe(result);
    } else {
      // No avatar upload, just update other fields
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updatedFields },
        { new: true, runValidators: true }
      ).select('-password -googleId');

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser
      });
    }
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating profile"
    });
  }
}



module.exports = {
  handleUserSignup,
  handleUserLogin,
  getCurrentUser,
  updateUserProfile,
};