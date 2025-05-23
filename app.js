const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const flash = require("connect-flash");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");
const { listingSchema, reviewSchema } = require("./schema.js");
const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const User = require("./models/user.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Database Connection with modern options
mongoose.connect(MONGO_URL, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("Connected to DB"))
.catch(err => console.log(err));

// Middleware Setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

// Session configuration with persistent store
app.use(session({
  store: MongoStore.create({
    mongoUrl: MONGO_URL,
    touchAfter: 24 * 3600 // 1 day
  }),
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // secure: true, // Enable in production
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));

// Security middleware
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global variables middleware
app.use((req, res, next) => {
  res.locals._csrf = req.csrfToken();
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes
const usersRouter = require("./routes/users");
const listingsRouter = require("./routes/listings");
const reviewsRouter = require("./routes/reviews");

app.use("/users", usersRouter);
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);

// Root route
app.get("/", (req, res) => res.send("Hi, I am root"));

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error", { message });
});

app.listen(8080, () => console.log("Server running on port 8080"));
