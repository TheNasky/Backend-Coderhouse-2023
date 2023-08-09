import ProductsModel from "../models/products.model.js";

export default class ProductsDao {
   getProducts = async () => {
      try {
         let products = await ProductsModel.find();
         return products;
      } catch (error) {
         console.log(error);
         return null;
      }
   };

   getProductById = async (id) => {
      try {
         let product = await ProductsModel.findOne({ _id: id });
         return product;
      } catch (error) {
         console.log(error);
         return null;
      }
   };

   getPopulatedProductById = async (id) => {
      try {
         let product = await ProductsModel.findOne({ _id: id }).populate(
            "items.product"
         );
         return product;
      } catch (error) {
         console.log(error);
         return null;
      }
   };

   createProduct = async (product) => {
      try {
         let Createdproduct = await ProductsModel.create(product);
         return Createdproduct
      } catch (error) {
         console.log(error);
         return null;
      }
   };
   paginateProducts = async (query, options) => {
      try {
         let result = await ProductsModel.paginate(query, options);
         return result
      } catch (error) {
         console.log(error);
         return null;
      }
   };

   updateProductWith = async (product, data) => {
      try {
         let result = await ProductsModel.findOneAndUpdate(product, data, {
            new: true,
         });
         return result;
      } catch (error) {
         console.log(error);
         return null;
      }
   };
   deleteProduct = async (id) => {
      try {
         let result = await ProductsModel.deleteOne({ _id: id });
      } catch (error) {
         console.log(error);
         return null;
      }
   };
   
}
