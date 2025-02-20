import * as Logger from 'bunyan'

import { Router,Response } from 'express'

/**
 * Base controller that handles abstracted logic common to all controllers in the application
 */
abstract class Controller {
  /**
   * Express Router object
   */
  protected router: Router

  /**
   * The controller constructor is responsible for setting up the router and initialising the routes to the the
   * implementing controller
   * @constructor
   */
  protected constructor(protected logger: Logger) {
    this.router = Router()
    this.setRoutes()
  }

  /**
   * Set the routes on the router object for the specific controller
   */
  abstract setRoutes(): void
  

  /**
   * Get the router object for the controller
   */
  public getRoutes(): Router {
    this.logger.debug('Retrieving routes for controller')
    return this.router
  }

    /**
   * Sends a formatted error response.
   * @param response - Express response object.
   * @param error - Error object containing a message and an optional code.
   * @returns A JSON response with error details.
   */
    protected handleError(response: Response, error: any): Response {
      return response.status(error.code || 500).json({
        success: false,
        code: error.code || 500,
        timestamp: new Date().getTime(),
        errorMessage: error.message || 'An unexpected error occurred.',
        data: null,
      });
    }
  
    /**
     * Sends a formatted success response.
     * @param response - Express response object.
     * @param data - The data to be sent in the response.
     * @returns A JSON response with success details.
     */
    protected sendResponse(response: Response, data: object): Response {
      return response.status(200).json({
        success: true,
        code: 200,
        timestamp: new Date().getTime(),
        errorMessage: null,
        data: data,
      });
    }
}

export { Controller }
