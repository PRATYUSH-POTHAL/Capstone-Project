import mongoose from "mongoose"

const connectDB = () => {
	const mongoUri = process.env.MONGO_URI

	if (!mongoUri) {
		mongoose.set("bufferCommands", false)
		console.warn(
			"MONGO_URI is not set. Add it to server/.env to enable database features."
		)
		return
	}

	if (mongoUri.includes("<db_password>")) {
		mongoose.set("bufferCommands", false)
		console.warn(
			"MONGO_URI still contains '<db_password>'. Replace it with your real MongoDB password (or use a local MongoDB URI) to enable database features."
		)
		return
	}

	mongoose
		.connect(mongoUri)
		.then((conn) => {
			const host = conn.connection.host
			console.log(`MongoDB connected: ${host}`)
		})
		.catch((error) => {
			console.error(`MongoDB connection error: ${error.message}`)
			process.exit(1)
		})
}

export default connectDB
