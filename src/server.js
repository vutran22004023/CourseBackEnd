import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes/index.js';
import cookieParser from 'cookie-parser';
import passport from './configs/passport.config.js';
import os from 'os';
import redisClient from './configs/redisClient.config.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import UpdateCourseStatus from './configs/updateStatusRoom.js';
import i18n from './configs/i18n.config.js';
import logger from './configs/logger.config.js';

const app = express();

// Get local IP address function
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    for (const interfaceInfo of interfaces[interfaceName]) {
      if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
        return interfaceInfo.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIPAddress();
const port = process.env.PORT || 3002;
const origin = `http://${localIP}:3002`;

// Configure CORS with local IP as origin
app.use(
  cors({
    origin: [origin, 'http://localhost:3000'], // Add both local IP and localhost origins
    credentials: true,
  })
);

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(i18n.init);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CourseNiver (API)',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'Bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/swagger/*.js'],
};
const openapiSpecification = swaggerJsdoc(options);

// Get language for I18N
app.use((req, _, next) => {
  let lang = req.query.lang || req.cookies.language || req.get('Accept-Language') || i18n.getLocale();
  i18n.setLocale(lang);
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use('/api', routes);
UpdateCourseStatus();

// Handle 404
app.use((_, res) => {
  res.status(404).json({
    status: 404,
    message: i18n.__('error.not_found'),
  });
});

// MongoDB connection URL
const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qm0ui7p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const server = app.listen(port, async () => {
  await mongoose
    .connect(url)
    .then(() => {
      logger.info('Connect DB successfully');
    })
    .catch((err) => {
      logger.error(err);
    });

  try {
    await redisClient.connect();
    logger.info('Connect Redis successfully');
  } catch (err) {
    logger.error('Redis connection error:', err);
  }

  logger.info(`Listening on port http://${localIP}:${port} with CORS origin ${origin}`);
  logger.info(`Listening on port http://localhost:${port} with CORS origin http://localhost:${port}`);
});

export { app, server, redisClient };
