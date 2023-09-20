const {authenticateToken, generateToken}  = require("./authenticateToken")
const {taskContentMiddleware} = require("./taskContentMiddleware")

module.exports = {
  generateToken,
  authenticateToken,
  taskContentMiddleware,
}
