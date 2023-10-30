import UserModel from '../models/user.model.js';

const UserHelper = {
  isEmailAlreadyExist: async (email) => {
    const user = await UserModel.findOne({ email: email });
    return user ? true : false;
  },
};

export default UserHelper;
