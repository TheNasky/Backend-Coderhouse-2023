import CartsModel from "../DAO/models/carts.model.js";
import ProductsModel from "../DAO/models/products.model.js";
import UsersModel from "../DAO/models/users.model.js";
import mongoose from "mongoose";

class CartsServices {
  async getAllCarts() {
    try {
      const carts = await CartsModel.find({});
      return { status: 200, result: { status: 'Success', payload: carts } };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        result: { status: 'error', msg: 'Something went wrong :(', payload: {} },
      };
    }
  }

  async getCartById(cid) {
    try {
      const cart = await CartsModel.findOne({ _id: cid }).populate("items.idProduct");
      if (!cart) {
        return {
          status: 404,
          result: { status: 'Error', msg: 'Cart not found', payload: {} },
        };
      }
      return { status: 200, result: { status: 'Success', msg: 'Displaying Cart: ' + cid, payload: cart } };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        result: { status: 'error', msg: 'Something went wrong :(', payload: {} },
      };
    }
  }

  async createCart() {
    try {
      const cart = await CartsModel.create({});
      return { status: 200, result: { status: 'Success', msg: 'Cart created', payload: cart } };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        result: { status: 'error', msg: 'Something went wrong :(', payload: {} },
      };
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const cart = await CartsModel.findOne({ _id: cid });
      if (!cart) {
        return { status: 404, result: { status: 'Error', msg: 'Cart not found', payload: {} } };
      }
      const product = await ProductsModel.findOne({ _id: pid });
      if (!product) {
        return { status: 404, result: { status: 'Error', msg: 'Product not found', payload: {} } };
      }
      const productExists = await CartsModel.findOne({ _id: cid, items: { $elemMatch: { idProduct: pid } } });
      if (productExists) {
        const result = await CartsModel.findOneAndUpdate(
          { _id: cid, items: { $elemMatch: { idProduct: pid } } },
          { $inc: { 'items.$.quantity': 1 } }
        );
        const updatedCart = await CartsModel.findOne({ _id: cid });
        return { status: 200, result: { status: 'Success', msg: 'Quantity increased by 1', payload: updatedCart } };
      } else {
        const cartWithNewProduct = await CartsModel.findOneAndUpdate(
          { _id: cid },
          { $push: { items: { idProduct: pid, quantity: 1 } } },
          { new: true }
        );
        const updatedCart = await CartsModel.findOne({ _id: cid });
        return { status: 200, result: { status: 'Success', msg: 'Product added to cart', payload: updatedCart } };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        result: { status: 'error', msg: 'Something went wrong :(', payload: {} },
      };
    }
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const cart = await CartsModel.findOne({ _id: cid });
      if (!cart) {
        return { status: 404, result: { status: 'Error', msg: 'Cart not found', payload: {} } };
      }
      const result = await CartsModel.findOneAndUpdate({ _id: cid }, { $pull: { items: { _id: pid } } }, { new: true });
      const updatedCart = await CartsModel.findOne({ _id: cid });
      return { status: 200, result: { status: 'Success', msg: 'Product deleted from cart', payload: updatedCart } };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        result: { status: 'error', msg: 'Something went wrong :(', payload: {} },
      };
    }
  }

  async updateCartWithProducts(cid, products) {
    try {
      const cart = await CartsModel.findOne({ _id: cid });
      if (!cart) {
        return { status: 404, result: { status: 'Error', msg: 'Cart not found', payload: {} } };
      }
      const newItems = products.map((product) => ({
        idProduct: new mongoose.Types.ObjectId(product.idProd),
        quantity: product.cant,
      }));
      const updatedCart = await CartsModel.findOneAndUpdate({ _id: cid }, { items: newItems }, { new: true });
      return { status: 200, result: { status: 'Success', msg: 'Cart items updated', payload: updatedCart } };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        result: { status: 'error', msg: 'Something went wrong :(', payload: {} },
      };
    }
  }

  async updateProductQuantityInCart(cid, pid, quantity) {
    try {
      const cart = await CartsModel.findOne({ _id: cid });
      if (!cart) {
        return { status: 404, result: { status: 'Error', msg: 'Cart not found', payload: {} } };
      }
      const productIndex = cart.items.findIndex((item) => item.idProduct.toString() === pid);
      if (productIndex === -1) {
        return { status: 404, result: { status: 'Error', msg: 'Product not found in cart', payload: {} } };
      }
      cart.items[productIndex].quantity = quantity;
      const updatedCart = await cart.save();
      return {
        status: 200,
        result: { status: 'Success', msg: 'Product quantity updated in cart', payload: updatedCart },
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        result: { status: 'error', msg: 'Something went wrong :(', payload: {} },
      };
    }
  }

  async emptyCart(cid) {
    try {
      const cart = await CartsModel.findOne({ _id: cid });
      if (!cart) {
        return { status: 404, result: { status: 'Error', msg: 'Cart not found', payload: {} } };
      }
      cart.items = [];
      const updatedCart = await cart.save();
      return { status: 200, result: { status: 'Success', msg: 'Cart emptied', payload: updatedCart } };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        result: { status: 'error', msg: 'Something went wrong :(', payload: {} },
      };
    }
  }

  async assignUserToCart(cartId, userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return {
          status: 400,
          result: {
            status: 'error',
            error: `Invalid cart or user ID.`,
          },
        };
      }

      const cart = await CartsModel.findById(cartId);
      if (!cart) {
        return {
          status: 404,
          result: {
            status: 'error',
            error: `Cart not found.`,
          },
        };
      }

      const user = await UsersModel.findById(userId);
      if (!user) {
        return {
          status: 404,
          result: {
            status: 'error',
            error: `User not found.`,
          },
        };
      }

      cart.user = userId;
      await cart.save();

      return {
        status: 200,
        result: {
          status: 'success',
          payload: cart,
        },
      };
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        result: {
          status: 'error',
          msg: 'Internal Server Error',
          payload: {},
        },
      };
    }
  }

}



export default CartsServices;
