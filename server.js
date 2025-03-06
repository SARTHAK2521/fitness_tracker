const express = require("express");
const path = require("path");
const session = require("express-session");
const fs = require("fs");  // JSON file handling ke liye

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ **Session Middleware**
app.use(session({
    secret: process.env.SESSION_SECRET || "your_secret_key", // ⚠️ Change this in production!
    resave: false,
    saveUninitialized: false
}));

// ✅ **Middleware**
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ **Static Files (CSS, JS, Images)**
app.use(express.static(path.join(__dirname, "public")));

// ✅ **Set View Engine**
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ **Authentication Middleware**
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();  // User logged in hai, aage jao
    }
    req.session.redirectUrl = req.originalUrl; // Login ke baad yahi wapas aaye
    res.redirect("/auth");  // Unauthorized users ko login page pe bhejo
}

// ✅ **Routes**
const workoutRoutes = require("./routes/workoutRoutes");
const dietRoutes = require("./routes/dietRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/workouts", workoutRoutes);
app.use("/diet", dietRoutes);
app.use("/auth", authRoutes);

// ✅ **Protected Home Route**
app.get("/", isAuthenticated, (req, res) => {
    res.render("home");
});

// ✅ **Logout Route**
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/auth");  // Logout hone ke baad login page pe bhejo
    });
});

// ✅ **404 Error Handler**
app.use((req, res) => {
    res.status(404).render("error", { message: "⚠️ Error: Page Not Found!" });
});

// ✅ **Start Server**
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
