import CartsModel from "../models/carts.model.js";

export default class CartsDao {
   getCarts = async () => {
      try {
         let carts = await CartsModel.find();
         return carts;
      } catch (error) {
         console.log(error);
         return null;
      }
   };

   getCartById = async (id) => {
      try {
         let cart = await CartsModel.findOne({ _id: id });
         return cart;
      } catch (error) {
         console.log(error);
         return null;
      }
   };
   
   getPopulatedCartById = async (id) => {
      try {
         let cart = await CartsModel.findOne({ _id: id }).populate(
            "items.product"
         );;
         return cart;
      } catch (error) {
         console.log(error);
         return null;
      }
   };

   createCart = async () => {
      try {
         let cart = await CartsModel.create({});
         return cart;
      } catch (error) {
         console.log(error);
         return null;
      }
   };
   updateCartWith = async (cart, data) => {
      try {
         let result = await CartsModel.findOneAndUpdate(cart,data,{ new: true })
         return result
      } catch (error) {
         console.log(error);
         return null;
      }
   };
   
}
