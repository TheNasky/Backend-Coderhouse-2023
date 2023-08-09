import UsersModel from "../models/users.model.js";

export default class UsersDao {
   getUsers = async () => {
      try {
         let users = await UsersModel.find();
         return users;
      } catch (error) {
         console.log(error);
         return null;
      }
   };

   getUserById = async (id) => {
      try {
         let user = await UsersModel.findOne({ _id: id });
         return user;
      } catch (error) {
         console.log(error);
         return null;
      }
   };

   createUser = async (user) => {
      try {
         let user = await UsersModel.create(user);
      } catch (error) {
         console.log(error);
         return null;
      }
   };
   updateUser = async (id, user) => {
      try {
         let result = await UsersModel.updateOne({ _id: id }, { $set: user });
      } catch (error) {
         console.log(error);
         return null;
      }
   };
}
