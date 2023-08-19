import ProductsModel from "../DAO/Mongo/models/products.model.js";
import { logger } from "../utils/logger.js";
export const getAllProductsRender=async (req, res) => {
    try {
        const limit =req.query.limit;
        const page =req.query.page;
        const sort =req.query.sort;
        const category = req.query.category;
        const inStock= req.query.inStock;
        let products
        let query = {};

        if (category) {
            query = { ...query, category: category };
        }
        if (inStock==="true") {
            query = { ...query, stock: {$gt: 0}};
        }
        if (inStock==="false") {
            query = { ...query, stock: 0};
        }
        let options = { limit: limit ?? 10, page: page ?? 1 };
        if (sort) {
            options.sort = { price: sort };
        }
        products= await ProductsModel.paginate(query,options)
        const list = {
            payload:products.docs.map((product) => product.toObject()),
            totalPages:products.totalPages,
            prevPage:products.prevPage,
            nextPage:products.nextPage,
            page:products.page,
            hasPrevPage:products.hasPrevPage,
            hasNextPage:products.hasNextPage,
            prevLink:products.hasPrevPage==true ? "link" : null,  // no se como crear el link
            nextLink:products.hasNextPage==true ? "link" : null,   // no se como crear el link
            user: req.session.user,
        }
        return res.status(200).render("products",list)
    } catch (e) {
        logger.error(`${error.stack}`)
        return res.status(500).json({
            status: "error",
            msg: "Something went wrong :(",
        });
    }
}