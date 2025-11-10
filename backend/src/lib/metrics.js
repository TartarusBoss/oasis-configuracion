import promClient from 'prom-client';

// Enable collection of default metrics
promClient.collectDefaultMetrics();

// Export custom counters for user actions
export const loginCounter = new promClient.Counter({
  name: 'oasis_login_attempts_total',
  help: 'Total login attempts',
  labelNames: ['status'],
});

export const registerCounter = new promClient.Counter({
  name: 'oasis_register_attempts_total',
  help: 'Total register attempts',
  labelNames: ['status'],
});

// Define the metrics middleware function
export const metricsMiddleware = async (req, res) => {
  try {
    res.set('Content-Type', promClient.register.contentType);
    const metrics = await promClient.register.metrics();
    res.end(metrics);
  } catch (err) {
    console.error('Error generating metrics:', err);
    res.status(500).end(err.toString());
  }
};