class userDTO {
   constructor(user) {
      this.name = user.firstName;
      this.last_name = user.lastName;
      this.email = user.email;
      this.roles = user.roles;
      this.cart = user.cart;
   }
}

module.exports = userDTO;
