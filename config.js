// Configuration file for transport app server
require('dotenv').config();

const config = {
  // Database Configuration
  database: {
    host: process.env.DB_HOST ,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME ,
    dateStrings: process.env.DB_DATE_STRINGS ===  true,
  },
  
  // Server Configuration
  server: {
    port: process.env.PORT ,
    nodeEnv: process.env.NODE_ENV ,
  },
  
  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN ,
  },
  
  // File Paths
  paths: {
    staticFiles: process.env.STATIC_FILES_PATH ,
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET ,
    expiresIn: process.env.JWT_EXPIRES_IN 
  }
};

module.exports = config;
