import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import postRoutes from "./routes/postRoutes.js"
import connectDB from "./config/db.js"

dotenv.config()
connectDB()

const port = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/posts", postRoutes)

app.get("/", (req, res) => {
  res.send("SCROLLA API is running")
})

app.listen(port, () =>
  console.log(`Server running on port ${port}`)
)
