import BookModel from '../models/book.model.js';

const BookHelper = {
  isRecipeExists: async (id) => {
    const user = await BookModel.findById(id);
    return user ? true : false;
  },
};

export default BookHelper;