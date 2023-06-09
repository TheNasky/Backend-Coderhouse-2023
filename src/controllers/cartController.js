import CartsServices from '../services/carts.services.js';

const cartsServices = new CartsServices();

export const getAllCarts = async (req, res) => {
  try {
    const result = await cartsServices.getAllCarts();
    res.status(result.status).json(result.result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      msg: 'Something went wrong :(',
    });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cid = req.params.cid;
    const result = await cartsServices.getCartById(cid);
    res.status(result.status).json(result.result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      msg: 'Something went wrong :(',
    });
  }
};

export const createCart = async (req, res) => {
  try {
    const result = await cartsServices.createCart();
    res.status(result.status).json(result.result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      msg: 'Something went wrong :(',
    });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid.trim();
    const result = await cartsServices.addProductToCart(cid, pid);
    res.status(result.status).json(result.result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      msg: 'Something went wrong :(',
    });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid.trim();
    const result = await cartsServices.deleteProductFromCart(cid, pid);
    res.status(result.status).json(result.result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      msg: 'Something went wrong :(',
    });
  }
};

export const updateCartWithProducts = async (req, res) => {
  try {
    const cid = req.params.cid.trim();
    const products = req.body;
    const result = await cartsServices.updateCartWithProducts(cid, products);
    res.status(result.status).json(result.result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      msg: 'Something went wrong :(',
    });
  }
};

export const updateProductQuantityInCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid.trim();
    const quantity = req.body.quantity;
    const result = await cartsServices.updateProductQuantityInCart(cid, pid, quantity);
    res.status(result.status).json(result.result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      msg: 'Something went wrong :(',
    });
  }
};

export const emptyCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const result = await cartsServices.emptyCart(cid);
    res.status(result.status).json(result.result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      msg: 'Something went wrong :(',
    });
  }
};
