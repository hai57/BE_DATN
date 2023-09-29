const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require("./routes/userRoute")
const scheduleRoute = require("./routes/scheduleRoute")
const taskRoute = require("./routes/taskRoute")
const notiRoute = require("./routes/notificationRoute")
const timeRoute = require("./routes/timeRoute")

var bodyParser = require("body-parser")

dotenv.config();

mongoose.connect((process.env.MONGODB_URL) , {useUnifiedTopology:true, useNewUrlParser: true})
  .then(() => {
    console.log('Mongo DB Connection successfull')
    app.listen(port, () => console.log(`Node JS server started in port ${port}`))
  }).catch((err) => {
    console.log('Mongo DB Connection Error')
  })
//Cấu hình Express để xử lý dữ liệu lớn, đa dạng
app.use(bodyParser.json({limit:"50mb"}))
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

app.use("/api/user", userRoute);
app.use('/api/schedule', scheduleRoute);
app.use('/api/task', taskRoute);
app.use('/api/noti', notiRoute);
app.use('/api/time', timeRoute);
