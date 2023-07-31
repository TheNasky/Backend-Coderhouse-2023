export const getSession = (req, res) => {
   return res.send(JSON.stringify(req.session));
};

export const logout = (req, res) => {
   req.session.destroy((err) => {
      if (err) {
         return res
            .status(500)
            .render("error", { error: "Failed to end session" });
      }
      return res.redirect("/auth/login");
   });
};

export const getProfile = (req, res) => {
   const user = { email: req.session.user.email };
   return res.render("profile", { user: user });
};

export const getAdmin = (req, res) => {
   return res.send("WIP");
};

export const getLogin = (req, res) => {
   return res.render("login", {});
};

export const postLogin = async (req, res) => {
   if (!req.user) {
      return res.json({ error: "invalid credentials" });
   }
   req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      age: req.user.age,
      cart: req.user.cart,
   };

   return res.status(200).redirect("../products");
};

export const failLogin = async (req, res) => {
   return res.json({ error: "fail to login" });
};

export const getRegister = (req, res) => {
   return res.render("register", {});
};

export const postRegister = (req, res) => {
   if (!req.user) {
      return res.json({ error: "Something went wrong :(" });
   }
   req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      age: req.user.age,
      cart: req.user.cart,
   };

   return res.status(200).redirect("profile");
};

export const failRegister = async (req, res) => {
   return res.json({ error: "Failed to register" });
};
