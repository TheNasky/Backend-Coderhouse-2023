import fs from "fs";
import ProductManager from "./productManager.js";

const productManager = new ProductManager("src/db/products.json")

if (!fs.existsSync ("src/db/carts.json")){
    fs.writeFileSync("src/db/carts.json", "[]")
};

export default class CartManager{
    constructor(path) {
        this.carts = [];
        this.path = path
    }

    async loadDB(){
        try {
            this.carts = JSON.parse(fs.readFileSync(this.path))
        } catch (error) {
            console.log("Error loading cart database",error)
        }
    }

    async updateDB(){
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2))
        } catch (error) {
            console.log("Error updating cart database",error)
        }
    }

    async createCart(product){
        await this.loadDB()
        if(product.id){
            this.carts.push({
                id:Date.now(),
                products:[{
                    product:product.id,
                    quantity:1
                }],
            })
            await this.updateDB();
        }else{
            return "error, invalid product"
        }   
        
       
    }

    async getCarts(){
        await this.loadDB()
        if(this.carts){
            return this.carts
        }else{
            console.log("Cart list is empty");
        }
    }

    async getCartById(id){
        await this.loadDB()
        const cartIfExists = this.carts.find(cart => cart.id == id);
        if(cartIfExists){
            return cartIfExists
        }else{
            console.log(`Failed to get Cart, Cart ${id} was not found`);
        }
    }

    async addProductToCart(cid, pid){
        await this.loadDB()
        const indexCart = this.carts.findIndex(cart => cart.id == cid)
        const productIfExists= await productManager.getProductById(pid)
        if(!indexCart){
            console.log(`error, cart ${cid} doesn't exist`)
        }else{
            if(productIfExists){
                const indexProduct= this.carts[indexCart].products.findIndex(product => product.product == pid)
                if(indexProduct!==-1){
                    this.carts[indexCart].products[indexProduct].quantity++
                }else{
                    this.carts[indexCart].products.push({
                        product:pid,
                        quantity:1
                    })
                }
                await this.updateDB();
            }else{
                console.log(`Error, product ${pid}doesn't exist`)
            }
        }
        
    }
} 

    // async removeProductFromCart(cid, pid){
    //     await this.loadDB()
    //     const indexCart = this.carts.findIndex(cart=> cart.id == cid)
    //     const indexProduct = this.carts[indexCart].findIndex(product=> product.product == pid)
    //     if(indexCart){
    //         if(indexProduct !== -1){
    //             this.carts[indexCart].products.splice(indexProduct,index+1) // this.carts[indexCart].products[indexCart].splice
    //             await this.updateDB() 
    //         }else{
    //             return `Failed to Delete Product, Product ${pid} was not found`
    //         }
    //     }else{ 
    //         return `Failed to Delete Product, cart ${cid} was not found`
    //     }
    // }

    // async deleteCart(id){
    //     await this.loadDB()
    //     const index = this.carts.findIndex(cart => cart.id == id)
    //     if(index !== -1){
    //         this.products.splice(index,index+1)
    //         await this.updateDB()
    //     }else{
    //         return `Failed to Delete cart, cart ${id} was not found`
    //     }
    // }

