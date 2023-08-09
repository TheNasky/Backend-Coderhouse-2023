import CartsDao from "../DAO/Mongo/DAOS/carts.dao.js";
import ProductsDAO from "../DAO/Mongo/DAOS/products.dao.js";
import UsersDAO from "../DAO/Mongo/DAOS/users.dao.js";
import mongoose from "mongoose";

const cartsDao = new CartsDao();
const productsDAO = new ProductsDAO();
const usersDAO = new UsersDAO();

class CartsServices {
   async getAllCarts() {
      try {
         const carts = await cartsDao.getCarts();
         return { status: 200, result: { status: "Success", payload: carts } };
      } catch (error) {
         console.log(error);
         return {
            status: 500,
            result: {
               status: "error",
               msg: "Something went wrong :(",
               payload: {},
            },
         };
      }
   }

   async getCartById(cid) {
      try {
         const cart = await cartsDao.getPopulatedCartById(cid);
         if (!cart) {
            return {
               status: 404,
               result: { status: "Error", msg: "Cart not found", payload: {} },
            };
         }
         return {
            status: 200,
            result: {
               status: "Success",
               msg: "Displaying Cart: " + cid,
               payload: cart,
            },
         };
      } catch (error) {
         console.log(error);
         return {
            status: 500,
            result: {
               status: "error",
               msg: "Something went wrong :(",
               payload: {},
            },
         };
      }
   }

   async createCart() {
      try {
         const cart = await cartsDao.createCart();
         return {
            status: 200,
            result: { status: "Success", msg: "Cart created", payload: cart },
         };
      } catch (error) {
         console.log(error);
         return {
            status: 500,
            result: {
               status: "error",
               msg: "Something went wrong :(",
               payload: {},
            },
         };
      }
   }

   async addProductToCart(cid, pid) {
      try {
         const cart = await cartsDao.getCartById(cid);
         if (!cart) {
            return {
               status: 404,
               result: { status: "Error", msg: "Cart not found", payload: {} },
            };
         }
         const product = await productsDAO.getProductById(pid);
         if (!product) {
            return {
               status: 404,
               result: {
                  status: "Error",
                  msg: "Product not found",
                  payload: {},
               },
            };
         }
         const productIndex = cart.items.findIndex(
            (item) => item.product.toString() === pid
         );
         if (productIndex !== -1) {
            await cartsDao.updateCartWith(
               { _id: cid, items: { $elemMatch: { product: pid } } },
               { $inc: { "items.$.quantity": 1 } }
            );
            return {
               status: 200,
               result: {
                  status: "Success",
                  msg: "Quantity increased by 1",
                  payload: cart,
               },
            };
         } else {
            await cartsDao.updateCartWith(
               { _id: cid },
               { $push: { items: { product: pid, quantity: 1 } } }
            );
            return {
               status: 200,
               result: {
                  status: "Success",
                  msg: "Product added to cart",
                  payload: cart,
               },
            };
         }
      } catch (error) {
         console.log(error);
         return {
            status: 500,
            result: {
               status: "error",
               msg: "Something went wrong :(",
               payload: {},
            },
         };
      }
   }

   async deleteProductFromCart(cid, pid) {
      try {
         const cart = await cartsDao.getCartById(cid);
         if (!cart) {
            return {
               status: 404,
               result: { status: "Error", msg: "Cart not found", payload: {} },
            };
         }
         await cartsDao.updateCartWith(
            { _id: cid },
            { $pull: { items: { _id: pid } } }
         );
         const updatedCart = await cartsDao.getCartById(cid);
         return {
            status: 200,
            result: {
               status: "Success",
               msg: "Product deleted from cart",
               payload: updatedCart,
            },
         };
      } catch (error) {
         console.log(error);
         return {
            status: 500,
            result: {
               status: "error",
               msg: "Something went wrong :(",
               payload: {},
            },
         };
      }
   }

   async updateCartWithProducts(cid, products) {
      try {
         const cart = await cartsDao.getCartById(cid);
         if (!cart) {
            return {
               status: 404,
               result: { status: "Error", msg: "Cart not found", payload: {} },
            };
         }
         const newItems = products.map((product) => ({
            product: new mongoose.Types.ObjectId(product.idProd),
            quantity: product.quantity,
         }));
         const updatedCart = await cartsDao.updateCartWith(
            { _id: cid },
            { items: newItems }
         );
         return {
            status: 200,
            result: {
               status: "Success",
               msg: "Cart items updated",
               payload: updatedCart,
            },
         };
      } catch (error) {
         console.log(error);
         return {
            status: 500,
            result: {
               status: "error",
               msg: "Something went wrong :(",
               payload: {},
            },
         };
      }
   }

   async updateProductQuantityInCart(cid, pid, quantity) {
      try {
         const cart = await cartsDao.getCartById(cid);
         if (!cart) {
            return {
               status: 404,
               result: { status: "Error", msg: "Cart not found", payload: {} },
            };
         }
         const productIndex = cart.items.findIndex(
            (item) => item.product.toString() === pid
         );
         if (productIndex === -1) {
            return {
               status: 404,
               result: {
                  status: "Error",
                  msg: "Product not found in cart",
                  payload: {},
               },
            };
         }
         cart.items[productIndex].quantity = quantity;
         const updatedCart = await cartsDao.updateCartWith({ _id: cid }, cart);
         return {
            status: 200,
            result: {
               status: "Success",
               msg: "Product quantity updated in cart",
               payload: updatedCart,
            },
         };
      } catch (error) {
         console.log(error);
         return {
            status: 500,
            result: {
               status: "error",
               msg: "Something went wrong :(",
               payload: {},
            },
         };
      }
   }

   async emptyCart(cid) {
      try {
         const cart = cartsDao.getCartById(cid);
         if (!cart) {
            return {
               status: 404,
               result: { status: "Error", msg: "Cart not found", payload: {} },
            };
         }
         cart.items = [];
         const updatedCart = await cartsDao.updateCartWith({ _id: cid }, cart);
         return {
            status: 200,
            result: {
               status: "Success",
               msg: "Cart emptied",
               payload: updatedCart,
            },
         };
      } catch (error) {
         console.log(error);
         return {
            status: 500,
            result: {
               status: "error",
               msg: "Something went wrong :(",
               payload: {},
            },
         };
      }
   }

   async assignUserToCart(cartId, userId) {
      try {
         if (
            !mongoose.Types.ObjectId.isValid(cartId) ||
            !mongoose.Types.ObjectId.isValid(userId)
         ) {
            return {
               status: 400,
               result: {
                  status: "error",
                  error: `Invalid cart or user ID.`,
               },
            };
         }

         const cart = await cartsDao.getCartById(cartId);
         if (!cart) {
            return {
               status: 404,
               result: {
                  status: "error",
                  error: `Cart not found.`,
               },
            };
         }

         const user = await usersDAO.getUserById(userId)
         if (!user) {
            return {
               status: 404,
               result: {
                  status: "error",
                  error: `User not found.`,
               },
            };
         }

         cart.user = userId;
         await cart.save();

         return {
            status: 200,
            result: {
               status: "success",
               payload: cart,
            },
         };
      } catch (err) {
         console.log(err);
         return {
            status: 500,
            result: {
               status: "error",
               msg: "Internal Server Error",
               payload: {},
            },
         };
      }
   }
}

export default CartsServices;
