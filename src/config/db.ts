// CONEXION CON PATRON SINGLETON
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

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



