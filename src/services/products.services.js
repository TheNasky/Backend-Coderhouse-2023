import ProductsModel from "../DAO/models/products.model.js";
import mongoose from "mongoose";

class ProductsServices {
   async getAllProducts(limit, page, sort, category, inStock) {
      let products;
      let query = {};

      if (category) {
         query = { ...query, category: category };
      }
      if (inStock === "true") {
         query = { ...query, stock: { $gt: 0 } };
      }
      if (inStock === "false") {
         query = { ...query, stock: 0 };
      }
      let options = { limit: limit ?? 10, page: page ?? 1 };
      if (sort) {
         options.sort = { price: sort };
      }
      products = await ProductsModel.paginate(query, options);
      return {
         status: 200,
         result: {
            status: "Success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage == true ? "link" : null, // no se como crear el link
            nextLink: products.hasNextPage == true ? "link" : null, // no se como crear el link
         },
      };
   }

   async getProductById(id) {
      if (!mongoose.isValidObjectId(id)) {
         return {
            status: 400,
            result: {
               status: "error",
               msg: "Invalid product ID",
               payload: {},
            },
         };
      } else {
         const product = await ProductsModel.findOne({ _id: id });
         return {
            status: 200,
            result: {
               status: "Success",
               msg: "Displaying Product: " + id,
               payload: product,
            },
         };
      }
   }
   async createProduct(product) {
      if (
         !product.title ||
         !product.description ||
         !product.code ||
         !product.price ||
         !product.stock ||
         !product.category
      ) {
         return {
            status: 400,
            result: {
               status: "error",
               msg: "Missing parameters.",
               payload: { product },
            },
         };
      } else {
         const finalProduct = await ProductsModel.create({
            title: product.title,
            description: product.description,
            code: product.code,
            price: product.price,
            status: product.status,
            stock: product.stock,
            category: product.category,
         });
         return {
            status: 200,
            result: {
               status: "Success",
               msg: "Product created",
               data: finalProduct,
            },
         };
      }
   }
   async updateProduct(id, product) {
      const updatedFields = {};
      [
         "title",
         "description",
         "code",
         "price",
         "status",
         "stock",
         "category",
      ].forEach((property) => {
         if (product[property]) {
            updatedFields[property] = product[property];
         }
      });
      if (Object.keys(updatedFields).length === 0) {
         console.log("Validation error: no fields to update.");
         return {
            status: 400,
            result: {
               status: "error",
               msg: "No fields to update.",
               payload: {},
            },
         };
      }
      if (!mongoose.isValidObjectId(id)) {
         return {
            status: 400,
            result: {
               status: "error",
               msg: "Invalid product ID",
               payload: {},
            },
         };
      }
      const updatedProduct = await ProductsModel.findByIdAndUpdate(
         id,
         updatedFields,
         { new: true }
      );
      return {
         status: 200,
         result: {
            status: "Success",
            msg: "Product: " + id + " updated",
            payload: updatedProduct,
         },
      };
   }

   async deleteProduct(id) {

      if (!mongoose.isValidObjectId(id)) {
         return {
            status: 400,
            result: {
               status: "error",
               msg: "Invalid product ID",
               payload: {},
            },
         };
      }
      const deletedProduct = await ProductsModel.deleteOne({ _id: id });
      return {
         status: 200,
         result: {
            status: "Success",
            msg: "Product: " + id + " deleted",
            payload: deletedProduct,
         },
      };
   }
}

export default ProductsServices;