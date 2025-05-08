const express = require('express');
const app = express();
const path = require('path');
const env = require('dotenv');
const cookieParser = require('cookie-parser');
const morgan = require('morgan'); // For logging HTTP requests
const helmet = require('helmet');
const cors = require('cors');

// Load environment variables
env.config({ path: './config.env' });

const swaggerDocs = require('./swagger/swaggerDocs');

//Routers
const userRouter = require('./routes/userRouter');
const stateRouter = require('./routes/stateRouter');
const cityRouter = require('./routes/cityRouter');
const packageRouter = require('./routes/packageRouter');
const addOnsRouter = require('./routes/addOnsRouter');
const areaRouter = require('./routes/areaRouter');
const locationRouter = require('./routes/locationRouter');
const slotBookingRouter = require('./routes/slotBookingRouter');

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

//cors options
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev')); // Log HTTP requests

// API Routes
app.use('/api/v1', userRouter);
app.use('/api/v1/states', stateRouter);
app.use('/api/v1/cities', cityRouter);
app.use('/api/v1/packages', packageRouter);
app.use('/api/v1/addOns', addOnsRouter);
app.use('/api/v1/areas', areaRouter);
app.use('/api/v1/locations', locationRouter);
app.use('/api/v1/slotbookings', slotBookingRouter);

// Initialize Swagger
swaggerDocs(app);
app.use('/home', (req, res) => {
  res.end('Home Page');
});
// Global Error Handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
