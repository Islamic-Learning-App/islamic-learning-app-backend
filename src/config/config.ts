export default () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),

  cors: {
    allowedOrigins: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4200',
      // Add other production origins here
    ],
  },

  throttler: {
    ttl: 5 * 60 * 1000,
    limit: 10000,
  },

  db: {
    uri: process.env.MONGODB_URI
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  google: {
    clientID:
      process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:
      process.env.GOOGLE_CALLBACK_URL
  },

  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string, 10),
    password: process.env.REDIS_PASSWORD,
  },
});
