// FRAMEWORK CONFIGURATION
const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const cloudinary = require('cloudinary').v2;
const dotenv = require("dotenv").config();
const session = require('express-session');
const passport = require("passport");
const passportStrategy = require('./config/passportConfig');
const jwt = require('jsonwebtoken');
const cookieSession = require('cookie-session');
const cors = require("cors");

connectDb();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
// app.use(cors());
const allowedOrigins = [
  "http://localhost:3000",
  "https://nutriinuts.onrender.com",
  "https://nurtriinuts1.onrender.com",
  "https://onesnackadmin4.onrender.com",
  "https://onesnack-admin.onrender.com",
  "https://onesnack1.onrender.com",
  "https://onesnack.onrender.com","https://www.nutriinuts.com",
  "http://localhost:7007","http://localhost:3001"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps or tools like Postman) or if origin is in allowedOrigins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
  })
);

const uploadRoutes = require('./routes/uploadRoutes');

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", require("./routes/auth"));


// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ROUTES BELOW


app.get('/', (req,res)=>{
  res.send("working");
});

app.use('/api', uploadRoutes);

// Route for All Products - ShopByCategoryPage
app.use("/api/allproducts", require("./routes/allProductsRoutes"));

// Route for new Launches
app.use("/api/newlaunches", require("./routes/newLaunchesRoutes"));

// Route for Gifting
app.use("/api/gifting", require("./routes/giftingRoutes"));

// Route for Blog
app.use("/api/blog", require("./routes/blogRoutes"));

// Route for User Registration and Authentication
app.use("/api/user", require("./routes/userRoutes"));

// Route for Cart
app.use("/api/cart", require("./routes/cartRoutes"));

// Route for Cart
app.use("/api/home", require("./routes/HomeSliderRoutes"));

// Route for OrderDetails
app.use('/api', require('./routes/OrderDetailRoutes'));

// Route for Feedback
app.use('/api', require('./routes/feedbackRoutes')); 

// Route for Rating
app.use('/api/rating', require('./routes/ratingRoutes'));

// Route for Offer (Newly added)
app.use('/api/offers', require('./routes/offerRoutes'));
//payment
app.use("/api/payment", require("./routes/paymentRoutes"));

// Error handling middleware
app.use(errorHandler);

// APP CONFIG START
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});