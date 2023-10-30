import UserModel from '../models/user.model.js';
import UserHelper from '../helpers/user.helper.js';
import jwt from 'jsonwebtoken';
import throwCustomError, { ErrorTypes, } from '../helpers/error-handler.helper.js';
import { GraphQLError } from 'graphql';

const userResolver = {
  Query: {
    getAllUsers: async() => {
      try {
         // if (!user) throw new Error('You are not authenticated!');
        const users = await UserModel.find().sort({ createdAt: -1 })
        return users;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getUsers: async (_, { total }, contextValue) => {
      try {
        // if (!user) throw new Error('You are not authenticated!');
        const users = await UserModel.find()
          .sort({ createdAt: -1 })
          .limit(total);
        return users;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },

    getUserById: async (_, { id }, contextValue) => {
      try {
         // if (!user) throw new Error('You are not authenticated!');
        const user = await UserModel.findById(id);
        return user;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },

  Mutation: {
    signup: async (_, { input }) => {
      const { name, email, password, permissions } = input;
      const isUserExists = await UserHelper.isEmailAlreadyExist(email);
      if (isUserExists) {
        throwCustomError(
          'Email is already Registered',
          ErrorTypes.ALREADY_EXISTS
        );
      }
      const userToCreate = new UserModel({
        name: name,
        email: email,
        password: password,
        permissions: permissions
      });
      const user = await userToCreate.save();
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: process.env.TOKEN_EXPIRY_TIME }
      );

      return {
        __typename: 'UserWithToken',
        ...user._doc,
        userJwtToken: {
          token: token,
        },
      };
    },

    login: async (_, { input: { name, email, password } }, context) => {
      const user = await UserModel.findOne({
        $and: [{ email: email }],
      });
      if (user) {
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_PRIVATE_KEY,
          { expiresIn: process.env.TOKEN_EXPIRY_TIME }
        );
        return {
          ...user._doc,
          userJwtToken: {
            token: token,
          },
        };
      }
      
      throwCustomError(
        'Invalid email or password entered.',
        ErrorTypes.BAD_USER_INPUT
      );
    },

    updateUser: async (parent, { input }) => {
      const { name, email, password, permissions } = input;
      const isExists = await UserHelper.isEmailAlreadyExist(email);
      if (!isExists) {
        throwCustomError(
          `Book with id ${id} does not exists.`,
          ErrorTypes.NOT_FOUND
        );
      }

      const user = await UserModel.findOneAndUpdate(
        { email: email, password: password},
        { name: name, email: email, password: password, permissions: permissions},
        { returnNewDocument: true }
      )
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: process.env.TOKEN_EXPIRY_TIME }
      );

      return {
        __typename: 'UserWithToken',
        ...user._doc,
        userJwtToken: {
          token: token,
        },
      };
    },

    deleteUser: async (parent, { email }) => {
      const isExists = await UserHelper.isEmailAlreadyExist(email);
      if (!isExists) {
        throwCustomError(
          `User with id ${id} does not exists.`,
          ErrorTypes.NOT_FOUND
        );
      }
      const isDeleted = (await UserModel.deleteOne({ email: email })).deletedCount;
      return {
        isSuccess: isDeleted, // return true if something is deleted, 0 if nothing is deleted
        message: 'User deleted.',
      };
    },
  },
};

export default userResolver;