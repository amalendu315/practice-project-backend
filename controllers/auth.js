import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";

// Register User
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, picturePath, friends , location, occupation } = req.body;

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });

        const savedUser = await newUser.save();

        res.status(201).json(savedUser);

    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        })
    }
};

// Login User
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        !user && res.status(400).json("User not found");

        const validPassword = await bcrypt.compare(password, user.password);

        !validPassword && res.status(400).json("Invalid credentials");

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "5d" });
        
        delete user.password;

        res.status(200).json({ user, accessToken });

    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
};