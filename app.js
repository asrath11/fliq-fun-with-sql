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

const swaggerDocs = require('./swagger/swaggerDocs'); // Ensure correct import

const userRouter = require('./routes/userRouter');
const stateRouter = require('./routes/stateRouter');
const cityRouter = require('./routes/cityRouter');
const packageRouter = require('./routes/packageRouter');
const addOnsRouter = require('./routes/addOnsRouter');

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(morgan('dev')); // Log HTTP requests

// API Routes
app.use('/api/v1', userRouter);
app.use('/api/v1/state', stateRouter);
app.use('/api/v1/city', cityRouter);
app.use('/api/v1/package', packageRouter);
app.use('/api/v1/addOns', addOnsRouter);

// Initialize Swagger
swaggerDocs(app);

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
