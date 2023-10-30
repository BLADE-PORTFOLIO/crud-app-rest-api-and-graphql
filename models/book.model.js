import { Schema, model } from 'mongoose';

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    
  },
  createdAt: String,
});

const BookModel = model('Book', bookSchema);
export default BookModel;