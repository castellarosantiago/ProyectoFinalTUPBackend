// conexion con patron singleton
import mongoose from 'mongoose';

// cuando corremos tests, si no hay MONGO_URI se creará un mongodb-memory-server
let mongoMemoryServer: any = null;
let isConnected = false;

export async function connect() {
  if (isConnected) return mongoose.connection;

  const options = {
    // opciones recomendadas por mongoose
    useNewUrlParser: true as const,
    useUnifiedTopology: true as const,
  };

  // obtener uri prioritaria de env
  let uri = process.env.MONGO_URI;

  // en tests, arrancar un mongodb-memory-server si no se proporcionó MONGO_URI
  if (!uri && process.env.NODE_ENV === 'test') {
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      uri = mongoMemoryServer.getUri();
      process.env.MONGO_URI = uri; // exponer para otros módulos/tests
    } catch (err) {
      console.error('Error arrancando mongodb-memory-server:', err);
      throw err;
    }
  }

  if (!uri) {
    console.error('Missing required environment variable: MONGO_URI.');
    throw new Error('MONGO_URI environment variable is not set');
  }

  await mongoose.connect(uri, options as any);
  isConnected = true;
  console.log('MongoDB connected');
  return mongoose.connection;
}

export async function disconnect() {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  if (mongoMemoryServer) {
    try {
      await mongoMemoryServer.stop();
      mongoMemoryServer = null;
    } catch (err) {
      console.error('Error stopping mongodb-memory-server:', err);
    }
  }
}





