import mongoose from "mongoose"

const connextToDatabase = async () => {
  mongoose.connect(process.env.mongodb_URL as string).then(() => {
    console.log("Connected to MongoDB")
  }).catch((error) => {
    console.log("Error connecting to MongoDB:", error)
  })
}

export default connextToDatabase