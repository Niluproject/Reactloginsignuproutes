import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config()
import crypto from 'crypto';
import bcrypt from 'bcrypt'
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connection Mongodb Database Start//

mongoose.connect("mongodb://localhost:27017/nileshrdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
}).then(() => {
    console.log("DB connected");
}).catch((error) => {
    console.log("Error connecting to database", error);
});

// Connection Mongodb Database End//

// Create login/Register Model start //

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    resetToken: String,
    resetTokenExpiration: Date
});

const User = new mongoose.model("User", userSchema);

// Create login/Register Model End //

// Routes Login //

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            if (password === user.password) {
                res.status(200).send({ message: "Login Successfull", user: user });
            } else {
                console.log(err);
                res.status(401).send({ error: "Password didn't match" });
            }
        } else {
            res.send({ message: "User not registered" });
        }
    } catch (error) {
        res.send({ message: "Error occurred", error: error });
    }
});

// Routes Login //

// Routes Register //

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            res.send({ message: "User already registered" });
        } else {
            const newUser = new User({
                name,
                email,
                password
            });
            await newUser.save();
            res.send({ message: "Successfully Registered, Please login now." });
        }
    } catch (error) {
        res.send({ message: "Error occurred", error: error });
    }
});

// Routes Register //

// Using Forgot password Implementation start //

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.PASSWORD
    }
});

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            // Generate a new password reset token and expiration date
            const token = crypto.randomBytes(20).toString('hex');
            const expiration = Date.now() + 3600000; // 1 hour

            // Update the user's password reset token and expiration date in the database
            await User.updateOne({ _id: user._id }, { resetToken: token, resetTokenExpiration: expiration });

            // Send a password reset email to the user's email address
            const mailOptions = {
                to: email,
                subject: 'Password Reset',
                text: `Hello ${user.name},\n\nYou are receiving this email because you (or someone else) has requested a password reset for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\nhttp://localhost:3000/reset-password/${token}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
            };
            await transporter.sendMail(mailOptions);

            res.status(200).send({ message: "A password reset link has been sent to your email address." });
        } else {
            res.status(404).send({ error: "User not found." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred while processing your request.", details: error.message });
    }
});


app.post('/reset-password', async (req, res) => {
    const { resetToken, password } = req.body;
    try {
        if (!resetToken || resetToken.trim() === '') {
            return res.status(400).send({ error: "Reset token is required." });
        }

        // Find the user with the given reset token and a valid reset token expiration date
        const user = await User.findOne({ resetToken: resetToken, resetTokenExpiration: { $gt: Date.now() } });

        if (user) {
            // Hash the new password and save it to the database
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.updateOne({ _id: user._id }, { password: hashedPassword, resetToken: null, resetTokenExpiration: null });

            res.status(200).send({ message: "Your password has been reset successfully." });
        } else {
            res.status(400).send({ error: "Invalid reset token." });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred while processing your request.", details: error.message });
    }
});



// Routes Register //

app.listen(9003, () => {
    console.log("BE started at port 9003");
});
