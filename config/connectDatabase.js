import mongoose from 'mongoose';

mongoose.set('strictQuery', true);
const connectDb = async() => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log('Database connected: ',
    connect.connection.host,
    connect.connection.name);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

export default connectDb;