const mongoose = require('mongoose')

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Connected to DB")
    } catch (error) {
        console.log("Connection Error: ", error)
    }
}