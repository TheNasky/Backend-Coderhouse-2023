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

   getUserByX = async (data) => {
      try {
         let user = await UsersModel.findOne(data);
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

   //borrar esto?
   updateUser = async (id, user) => {
      try {
         let result = await UsersModel.updateOne({ _id: id }, { $set: user });
      } catch (error) {
         console.log(error);
         return null;
      }
   };
   //
   updateUserWith = async (user, data) => {
      try {
         let result = await UsersModel.findOneAndUpdate(user, data, { new: true });
         return result;
      } catch (error) {
         console.log(error);
         return null;
      }
   };
}
