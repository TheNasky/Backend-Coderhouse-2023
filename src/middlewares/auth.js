import UsersDAO from "../DAO/Mongo/DAOS/users.dao.js";
const usersDAO = new UsersDAO();


export function isUser(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   }
   return res.status(401).render("error", { error: "Error de autenticación!" });
}

export function isAdmin(req, res, next) {
   if (req.session?.user.roles?.includes("Admin")) {
      return next(); 
   }
   return res.status(403).render("error", { error: "Error de autorización!" });
}

export function isCartOwner(req, res, next) {
   if (req.session?.user.cart == req.params.cid) {
      return next();
   }
   return res.status(403).render("error", { error: "Error de autorización!" });
}
