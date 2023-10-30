import BookModel from '../models/book.model.js';
import BookHelper from '../helpers/book.helper.js';
import throwCustomError, { ErrorTypes, } from '../helpers/error-handler.helper.js';
import UserModel from '../models/user.model.js';

const bookResolver = {
  Query: {
    async getAllBooks(parent, args, {user}) {
      const chainBooks = [];
      const books = await BookModel.find().sort({ createdAt: -1 });
      for (const book of books) {
          const chain = {};
          chain.id = book._id;
          chain.title = book.title;
          const author = await UserModel.findById(book.author.toString());
          if (author) {
            chain.author = author;
          }
          chainBooks.push(chain);
      }
      return chainBooks;
    },

    async getBooks(parent, { amount }, contextValue) {
      const chainBooks = [];
      const books = await BookModel.find().sort({ createdAt: -1 }).limit(amount);
      for (const book of books) {
          const chain = {};
          chain.id = book._id;
          chain.title = book.title;
          const author = await UserModel.findById(book.author.toString());
          if (author) {
            chain.author = author;
          }
          chainBooks.push(chain);
      }
      return chainBooks;
    },

    getBookById: async (parent, { id }, contextValue) => {
      const book = await BookModel.findById(id);

      if (!book) {
        throwCustomError(`Book with id ${id} does not exist.`, ErrorTypes.NOT_FOUND);
      }
      const author = await UserModel.findById(book.author);
      if (!author) {
        return {};
      }
      return {
        id: book._id,
        ...book._doc,
        author: author,
      };
    },
  },

  Mutation: {
    createBook: async (parent, { bookInput: { title, author } }, contextValue) => 
    {
      const createdBook = new BookModel({
        title: title,
        author: author,
        createdAt: new Date().toISOString(),
      });
      const book = await createdBook.save();
      const author1 = await UserModel.findById(book.author.toString());
      return {
        id: book._id,
        ...book._doc,
        author: author1,
      };
    },

    deleteBook: async (_, { id }, contextValue) => {
      const isExists = await BookHelper.isBookExists(id);
      if (!isExists) {
        throwCustomError(
          `Book with id ${id} does not exists.`,
          ErrorTypes.NOT_FOUND
        );
      }
      const isDeleted = (await BookModel.deleteOne({ _id: id })).deletedCount;
      return {
        isSuccess: isDeleted,
        message: 'Book deleted.',
      };
    },

    editBook: async (_, { id, bookInput: { name, author } }, { user }) => 
    {
      const isExists = await BookHelper.isBookExists(id);
      if (!isExists) {
        throwCustomError(
          `Book with id ${id} does not exists.`,
          ErrorTypes.NOT_FOUND
        );
      }
      const isEdited = (
        await BookModel.updateOne(
          { _id: id },
          { name: name, author: author }
        )
      ).modifiedCount;
      return {
        isSuccess: isEdited,
        message: 'Book Edited.',
      };
    },
  },
};

export default bookResolver;