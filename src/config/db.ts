// CONEXION CON PATRON SINGLETON
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  // Fail fast with a helpful message instead of passing undefined into mongoose.connect
  console.error('Missing required environment variable: MONGO_URI.\nPlease create a .env file or set MONGO_URI in your environment. Example:\nMONGO_URI=mongodb://user:pass@host:port/dbname');
  throw new Error('MONGO_URI environment variable is not set');
}

let isConnected = false;

async function connect() {
  if (isConnected) {
    return mongoose.connection;
  }

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  await mongoose.connect(MONGO_URI, options);
  isConnected = true;
  console.log('MongoDB connected');
  return mongoose.connection;
}

async function disconnect() {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
}

module.exports = { connect, disconnect };



