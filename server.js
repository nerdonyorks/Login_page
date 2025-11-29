const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const hbs = require("hbs");

const app = express();

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views/layouts"));


app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Disable caching (back-button fix)
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});//middile ware

// Login route
app.get("/", (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect("/home");
  }
  res.render("login", { error: null });
});

// Login validation
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const validUser = "admin";
  const validPass = "1234";

  if (username === validUser && password === validPass) {
    req.session.loggedIn = true;
    return res.redirect("/home");
    
  }

  res.render("login", { error: "Incorrect username or password" });
});

// Protected Route
app.get("/home", (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect("/");
  }
  res.render("home");
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
