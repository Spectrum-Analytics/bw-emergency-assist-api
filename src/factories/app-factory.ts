import express from 'express';
import * as HTTPContext from 'express-http-context';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import { CorrelationIdMiddleware } from '../middleware/correlation-id-middleware';
import { SecurityMiddleware } from '../middleware/security-middleware';
import {  EmergencyAssistController } from '../controllers/emergency-assist-controller'; 
const fileUpload = require('express-fileupload');

/**
 * App Factory creates and initializes and new instance of the application
 */
class AppFactory {
  /**
   * Get a configured application instance
   */
  public static getInstance(
    main: EmergencyAssistController, 
  ): express.Express {
    const app: express.Express = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(HTTPContext.middleware);
    app.use(fileUpload());
    app.use(cors);
    app.use(CorrelationIdMiddleware.getMiddleware());

    app.use('/api/v1', main.getRoutes());

    return app;
  }
}

export { AppFactory };
