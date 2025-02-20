"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrelationIdMiddleware = void 0;
const uuid = __importStar(require("uuid"));
const HTTPContext = __importStar(require("express-http-context"));
/**
 * Correlation ID middleware component extracts an existing correlation ID, if it exists, from the incoming request, or
 * generates a new correlation ID and attaches it to the request, the response and sets it to the request context
 */
class CorrelationIdMiddleware {
    /**
     * Get the middleware component
     */
    static getMiddleware() {
        return (req, res, next) => {
            var _a;
            const correlationId = (_a = req.get('correlationId')) !== null && _a !== void 0 ? _a : uuid.v4();
            req.headers['correlationId'] = correlationId;
            res.set('correlationId', correlationId);
            HTTPContext.set('correlationId', correlationId);
            next();
        };
    }
}
exports.CorrelationIdMiddleware = CorrelationIdMiddleware;
//# sourceMappingURL=correlation-id-middleware.js.map