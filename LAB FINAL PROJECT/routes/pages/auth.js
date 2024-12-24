// Middleware to check if the user is logged in
exports.checkLoggedIn = (req, res, next) => {
    console.log("Session User:", req.session.user);  // Log the session user to see if it's set
    if (req.session && req.session.user) {
        next(); // Proceed if the user is logged in
    } else {
        res.redirect("/login"); // Redirect to the login page if not logged in
    }
};
// Middleware to bypass login if the user is already logged in
exports.bypassLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        next(); // Proceed if the user is not logged in
    } else {
        res.redirect("/admin/products"); // Redirect logged-in users to admin/products
    }
};

// auth.js
module.exports.bypassLogin = (req, res, next) => {
    if (req.session.user) {
        return res.redirect("/webPages/wishlist"); // Redirect logged-in users to their wishlist
    }
    next();
  };
  
  module.exports.requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/user_auth/user-login"); // Redirect unauthenticated users to the login page
    }
    next();
  };
  
// auth.js
module.exports.bypassLogin = (req, res, next) => {
    if (req.session.user) {
        return res.redirect("/webPages/wishlist"); // Redirect logged-in users to their wishlist
    }
    next();
  };
  
  module.exports.requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/user_auth/user-login"); // Redirect unauthenticated users to the login page
    }
    next();
  };
  