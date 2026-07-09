const client = require('prom-client');

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'mern-ecommerce-api'
});

// Enable the collection of default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

// 1. Counter: Total Orders Placed
// This only goes UP. Every time a checkout succeeds, we increment it.
const ordersTotal = new client.Counter({
  name: 'ecommerce_orders_total',
  help: 'Total number of orders placed',
  labelNames: ['status']
});

// 2. Counter: Checkout Failures
const checkoutFailuresTotal = new client.Counter({
  name: 'ecommerce_checkout_failures_total',
  help: 'Total number of failed checkout attempts',
  labelNames: ['reason']
});

// 3. Histogram: Request Latency (Response Time)
// This tracks the distribution of how long requests take.
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in microseconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // ranges in seconds
});

// 4. Gauge: Active Users
// This can go UP and DOWN. It tracks the current state.
const activeUsersGauge = new client.Gauge({
  name: 'ecommerce_active_users',
  help: 'Current number of active users on the platform'
});

// Register custom metrics
register.registerMetric(ordersTotal);
register.registerMetric(checkoutFailuresTotal);
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(activeUsersGauge);

module.exports = {
  register,
  ordersTotal,
  checkoutFailuresTotal,
  httpRequestDurationMicroseconds,
  activeUsersGauge
};
