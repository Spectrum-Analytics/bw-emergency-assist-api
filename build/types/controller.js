"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const express_1 = require("express");
/**
 * Base controller that handles abstracted logic common to all controllers in the application
 */
class Controller {
    /**
     * The controller constructor is responsible for setting up the router and initialising the routes to the the
     * implementing controller
     * @constructor
     */
    constructor(logger) {
        this.logger = logger;
        this.router = (0, express_1.Router)();
        this.setRoutes();
    }
    /**
     * Get the router object for the controller
     */
    getRoutes() {
        this.logger.debug('Retrieving routes for controller');
        return this.router;
    }
    /**
   * Sends a formatted error response.
   * @param response - Express response object.
   * @param error - Error object containing a message and an optional code.
   * @returns A JSON response with error details.
   */
    handleError(response, error) {
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
    sendResponse(response, data) {
        return response.status(200).json({
            success: true,
            code: 200,
            timestamp: new Date().getTime(),
            errorMessage: null,
            data: data,
        });
    }
}
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map