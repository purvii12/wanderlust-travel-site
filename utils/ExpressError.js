// // utils/ExpressError.js
// class ExpressError extends Error {
//     /**
//      * Custom error class for HTTP error handling
//      * @param {number} status - HTTP status code
//      * @param {string} message - Error message
//      */
//     constructor(status, message) {
//         super(message);
//         this.status = status;
//         this.name = this.constructor.name;
//         Error.captureStackTrace(this, this.constructor);
//     }

//     /**
//      * Custom string representation of the error
//      * @returns {string} Error description
//      */
//     toString() {
//         return `${this.name} [${this.status}]: ${this.message}`;
//     }

//     /**
//      * Create an error object for API responses
//      * @returns {Object} Error response format
//      */
//     toJSON() {
//         return {
//             status: this.status,
//             message: this.message,
//             stack: process.env.NODE_ENV === 'development' ? this.stack : undefined
//         };
//     }
// }

// module.exports = ExpressError;


class ExpressError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
module.exports = ExpressError;
