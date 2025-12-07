import mongoose from 'mongoose'

// Track connection status
let isConnected = false

mongoose.connection.on('connected', () => {
  isConnected = true
  console.log('✅ MongoDB connection established')
})

mongoose.connection.on('error', (err) => {
  isConnected = false
  console.error('❌ MongoDB connection error:', err.message)
})

mongoose.connection.on('disconnected', () => {
  isConnected = false
  console.warn('⚠️  MongoDB disconnected')
})

const connectDB = async () => {
  // Don't reconnect if already connected
  if (mongoose.connection.readyState === 1) {
    console.log('✅ MongoDB already connected')
    return mongoose.connection
  }

  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tics'
    
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    }

    // Add SSL options if using MongoDB Atlas
    if (mongoURI.includes('mongodb+srv://')) {
      options.tls = true
      options.tlsAllowInvalidCertificates = false
    }

    console.log('🔄 Attempting to connect to MongoDB...')
    const conn = await mongoose.connect(mongoURI, options)
    isConnected = true
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    isConnected = false
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    console.error('\n💡 Troubleshooting Tips:')
    console.error('1. If using local MongoDB, make sure MongoDB service is running')
    console.error('   Check: netstat -ano | findstr ":27017"')
    console.error('2. If using MongoDB Atlas, check your connection string')
    console.error('3. Verify MONGODB_URI in server/.env file')
    console.error('4. Check network/firewall settings')
    console.error('5. See server/MONGODB_SETUP.md for detailed setup guide\n')
    // Don't exit - let the app continue (admin init will handle gracefully)
    return null
  }
}

export { isConnected }
export default connectDB

