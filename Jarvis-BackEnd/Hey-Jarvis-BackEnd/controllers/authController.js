
//In dev Use the one below 
import User from "../models/UserCollection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Already exists
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res
            .cookie("token", token, {
                httpOnly: true,
                secure: true,             // ✅ required in production (HTTPS)
                sameSite: "None",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            .status(200)
            .json({ msg: "Login successful", userId: user._id });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ msg: "Login failed", error: err.message });
    }
};


export const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,    // Match what was used in login
        sameSite: "None" // Also match this
    });
    res.status(200).json({ msg: "Logged out successfully" });
};

//  Register logic
export const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ msg: "Email already in use" });

        const newUser = new User({ email, password, name });
        await newUser.save();

        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Registration failed", error: err.message });
    }
};






// //for Production use the One Below:
// import User from "../models/UserCollection.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config();

// // Already exists
// export const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ msg: "User not found" });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

//         const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//             expiresIn: "7d",
//         });

//         res.cookie("token", token, {
//                 httpOnly: true,
//                 secure: true,             // ✅ required in production (HTTPS)
//                 sameSite: "Lax",
//                 maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days

//             })
//             .status(200)
//             .json({ msg: "Login successful", userId: user._id });
//     } catch (err) {
//         console.error("Login Error:", err);
//         res.status(500).json({ msg: "Login failed", error: err.message });
//     }
// };


// export const logoutUser = (req, res) => {
//     res.clearCookie("token", {
//         httpOnly: true,
//         secure: true,    // Match what was used in login
//         sameSite: "Lax", // Also match this

//   });
//     res.status(200).json({ msg: "Logged out successfully" });
// };


// //  Register logic
// export const registerUser = async (req, res) => {
//     try {
//         const { email, password, name } = req.body;

//         const existingUser = await User.findOne({ email });
//         if (existingUser)
//             return res.status(400).json({ msg: "Email already in use" });

//         const newUser = new User({ email, password, name });
//         await newUser.save();

//         res.status(201).json({ msg: "User registered successfully" });
//     } catch (err) {
//         res.status(500).json({ msg: "Registration failed", error: err.message });
//     }
// };

