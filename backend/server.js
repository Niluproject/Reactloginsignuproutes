import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

// Connection Mongodb Database Start//

mongoose.connect("mongodb://localhost:27017/nileshrdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB connected")
}).catch((error) => {
    console.log("Error connecting to database", error)
})

// Connection Mongodb Database End//

// Create login/Register Model start //

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

// Create login/Register Model End //

// Routes Login //

app.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email: email })
        if (user) {
            if (password === user.password) {
                res.status(200).send({ message: "Login Successfull", user: user })
            } else {
                console.log(err);
                res.status(401).send({ error: "Password didn't match" })
            }
        } else {
            res.send({ message: "User not registered" })
        }
    } catch (error) {
        res.send({ message: "Error occurred", error: error })
    }
})

// Routes Login //

// Routes Register //

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body
    try {
        const user = await User.findOne({ email: email })
        if (user) {
            res.send({ message: "User already registered" })
        } else {
            const newUser = new User({
                name,
                email,
                password
            })
            await newUser.save()
            res.send({ message: "Successfully Registered, Please login now." })
        }
    } catch (error) {
        res.send({ message: "Error occurred", error: error })
    }
})

// Routes Register //

app.listen(9003, () => {
    console.log("BE started at port 9003");
});
