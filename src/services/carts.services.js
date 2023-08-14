import CartsDao from "../DAO/Mongo/DAOS/carts.dao.js";
import ProductsDAO from "../DAO/Mongo/DAOS/products.dao.js";
import UsersDAO from "../DAO/Mongo/DAOS/users.dao.js";
import TicketsModel from "../DAO/Mongo/models/tickets.models.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

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
               msg: "Internal Server Error",
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
         const productIndex = cart.items.findIndex((item) => item.product.toString() === pid);
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
               msg: "Internal Server Error",
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
         await cartsDao.updateCartWith({ _id: cid }, { $pull: { items: { _id: pid } } });
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
               msg: "Internal Server Error",
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
            product: new mongoose.Types.ObjectId(product.product),
            quantity: product.quantity,
         }));
         const updatedCart = await cartsDao.updateCartWith({ _id: cid }, { items: newItems });
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
               msg: "Internal Server Error",
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
         const productIndex = cart.items.findIndex((item) => item.product.toString() === pid);
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
               msg: "Internal Server Error",
               payload: {},
            },
         };
      }
   }

   async emptyCart(cid) {
      try {
         const cart = await cartsDao.getCartById(cid);
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
               msg: "Internal Server Error",
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

         const user = await usersDAO.getUserById(userId);
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
   async purchaseCart(cid) {
      try {
         if (!mongoose.Types.ObjectId.isValid(cid)) {
            return {
               status: 400,
               result: {
                  status: "error",
                  error: `Invalid cart ID`,
               },
            };
         }
         const cart = await cartsDao.getCartById(cid);
         if (!cart) {
            return {
               status: 400,
               result: {
                  status: "error",
                  error: `Cart not found`,
               },
            };
         }
         if (cart.items.length <= 0) {
            return {
               status: 400,
               result: {
                  status: "error",
                  error: `Cart is empty`,
               },
            };
         }
         const productsNotPurchased = [];
         const productsPurchased = [];
         let totalAmount = 0;
         const purchaseProducts = await Promise.all(
            cart.items.map(async (item) => {
               const currentProduct = await productsDAO.getProductById(item.product);
               if (!currentProduct) {
                  // Handle the case where the product is not found
                  productsNotPurchased.push({
                     product: item.product,
                     quantity: item.quantity,
                  });
                  return;
               }
               if (currentProduct.stock >= item.quantity) {
                  productsPurchased.push({
                     product: currentProduct,
                     quantity: item.quantity,
                  });
                  currentProduct.stock -= item.quantity;
                  await currentProduct.save();
                  totalAmount += currentProduct.price * item.quantity;
               } else {
                  productsNotPurchased.push({
                     product: currentProduct,
                     quantity: item.quantity,
                  });
               }
            })
         );
         const newTicket = {
            code: uuidv4(),
            amount: totalAmount,
            purchaser: cart.user,
            products: productsPurchased,
         };
         const createdTicket = await TicketsModel.create(newTicket);
         await this.emptyCart(cart._id);
         await this.updateCartWithProducts(cid, productsNotPurchased);
         return {
            status: 200,
            result: {
               status: "success",
               msg: "Products purchased successfully",
               payload: {
                  ticket: createdTicket,
               },
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
   async getTickets() {
      try {
         const tickets = await TicketsModel.find({});
         return {
            status: 200,
            result: {
               status: "success",
               msg: "Displaying all tickets",
               payload: tickets,
            },
         };
      } catch (error) {
         console.error(error);
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
