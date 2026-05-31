import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";
export const signUp = async (req, res) => {
    try {


        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: "Username already in use" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedpassword
        });
        await newUser.save();
        const token = await genToken(newUser._id);
        res.cookie("token", token, {
            httpOnly: true, secure: false, sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });

        return res.status(201).json({ message: "User created successfully", user: newUser });
    }
    catch (error) {
        console.error("Error during sign up:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {

            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true, secure: false, sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });
        return res.status(200).json({ message: "Login successful", user });
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const logOut = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "lax", path: "/" });
        return res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
