export function isUser(req, res, next) {
   if (req.session?.user.email) {
      return next();
   }
   return res.status(401).render("error", { error: "Error de autenticación!" });
}

export function isAdmin(req, res, next) {
   if (req.session?.roles.includes("admin")) {
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
    