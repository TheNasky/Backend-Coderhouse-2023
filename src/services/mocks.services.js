import { faker } from '@faker-js/faker/locale/es_MX';


class MocksServices {
   generateProduct() {
      return {
         _id: faker.database.mongodbObjectId(),
         title: faker.commerce.productName(),
         description: faker.commerce.productDescription(),
         code: `a${faker.finance.pin(4)}`,
         price: faker.commerce.price({ min: 4, max: 40, dec: 0 }),
         status:true,
         stock: faker.number.int({ max: 100 }),
         category: faker.commerce.department(),
         thumbnails: [faker.image.avatarGitHub()],
      };
   }

   get100Products() {
      try {
         const products = Array.from({ length: 100 }, () => this.generateProduct());
         return { status: 200, result: { status: "success", payload: products } };
      } catch (error) {
         console.error(error);
         return {
            status: 500,
            result: { status: "error", msg: "Internal Server Error", payload: {} },
         };
      }
   }
}

export default MocksServices;
