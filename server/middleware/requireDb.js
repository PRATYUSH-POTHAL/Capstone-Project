import mongoose from 'mongoose'

export const requireDb = (req, res, next) => {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message:
        'Database is not connected. Check server/.env (MONGO_URI) and restart the server.',
    })
  }

  next()
}
