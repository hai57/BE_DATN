const {authenticateToken, generateToken}  = require("./authenticateToken")
const {getScheduleId} = require("./getSchedule")

module.exports = {
  generateToken,
  authenticateToken,
  getScheduleId,
}
