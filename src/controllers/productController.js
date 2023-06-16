import ProductsModel from "../DAO/models/products.model.js";

export const getAllProducts=async (req, res) => {
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
        return res.status(200).json({
            status: "Success",
            payload:products.docs,
            totalPages:products.totalPages,
            prevPage:products.prevPage,
            nextPage:products.nextPage,
            page:products.page,
            hasPrevPage:products.hasPrevPage,
            hasNextPage:products.hasNextPage,
            prevLink:products.hasPrevPage==true ? "link" : null,  // no se como crear el link
            nextLink:products.hasNextPage==true ? "link" : null   // no se como crear el link
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "Something went wrong :(",
        });
    }
}

export const getProductById= async (req, res) => {
    try {
        const id = req.params.pid;
        const product = await ProductsModel.findOne({_id : id});
        return res.status(200).json({
            status: "Success",
            msg: "Displaying Product: " + id,
            data: product,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "Something went wrong :(",
            data: {},
        });
    }
}

export const createProduct = async (req, res) => {
    const { title, description, code, price, status, stock, category } = req.body;
    try {
        if (!title || !description || !code || !price || !stock || !category) {
            console.log("Validation error: please complete all fields.");
            return res.status(400).json({
            status: "error",
            msg: "Please complete all fields.",
            data: {},
            });
        }else{
            const product = await ProductsModel.create({
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
            });
            const socketServer = req.socketServer;
            socketServer.sockets.emit('refresh', 'refresh');
            return res.status(201).json({
                status: "success",
                msg: "Product created",
                data: product,
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "Something went wrong :(",
            data: {},
        });
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { title, description, code, price, status, stock, category } = req.body;
    
    try {
      const updatedFields = {};
      ["title", "description", "code", "price", "status", "stock", "category"].forEach((property) => {
        if (req.body[property]) {
          updatedFields[property] = req.body[property];
        }
      });
      if (Object.keys(updatedFields).length === 0) {
        console.log("Validation error: no fields to update.");
        return res.status(400).json({
          status: "error",
          msg: "No fields to update.",
          data: {},
        });
      }
      const productUpdated = await ProductsModel.findByIdAndUpdate(
        id,
        updatedFields,
        { new: true }
      );
      const socketServer = req.socketServer;
      socketServer.sockets.emit("refresh", "refresh");
      return res.status(200).json({
        status: "success",
        msg: "Product: "+id+" updated",
        data: productUpdated,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: "Something went wrong :(",
        data: {},
      });
    }
  }

  export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ProductsModel.deleteOne({ _id: id });
        const socketServer = req.socketServer;
        socketServer.sockets.emit('refresh', 'refresh');
        return res.status(200).json({
            status: "Success",
            msg: "Product: "+id+" deleted",
            data: {},
        }); 
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "Something went wrong :(",
            data: {},
        });
    }
}



