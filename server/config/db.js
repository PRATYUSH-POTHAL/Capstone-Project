import mongoose from 'mongoose'

// Fail fast if code tries to query before connection is ready.
// We ensure the app awaits connectDB() during startup.
mongoose.set('bufferCommands', false)

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI

  if (!mongoUri) {
    console.warn('MONGODB_URI is not set. Add it to server/.env to enable database features.')
    return false
  }

  if (mongoUri.includes('<db_password>') || mongoUri.includes('<password>')) {
    console.warn(
      "MONGODB_URI still contains '<db_password>' or '<password>'. Replace it with your real MongoDB password to enable database features."
    )
    return false
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    })
    console.log(`MongoDB connected: ${conn.connection.host}`)
    return true
  } catch (err) {
    console.error(`MongoDB connection error: ${err?.message || err}`)
    throw err
  }
}

export default connectDB