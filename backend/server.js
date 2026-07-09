const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const config = require('./config/config');
const { register, httpRequestDurationMicroseconds } = require('./utils/metrics');

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: true, // Allows any origin to facilitate development and Minikube tunnels
  credentials: true
}));

// Prometheus Metrics Middleware - Must be near the top to track all requests
app.use((req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const duration = diff[0] + diff[1] / 1e9; // convert to seconds
    
    // We only want to track API routes, not static assets or metrics itself
    if (req.path.startsWith('/api')) {
      httpRequestDurationMicroseconds
        .labels(req.method, req.route ? req.route.path : req.path, res.statusCode)
        .observe(duration);
    }
  });
  
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static Assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');
const analyticsRoutes = require('./routes/analytics');
const chatbotRoutes = require('./routes/chatbot');
const reviewRoutes = require('./routes/reviews');
const paymentRoutes = require('./routes/payment.routes');
const errorHandler = require('./middlewares/error');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);

// Prometheus /metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Error Handler (must be last)
app.use(errorHandler);

// Start Server
app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📡 Database URI: ${config.mongodbUri}`);
});