import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import userRoute from './routes/userRoute.js';
import scheduleRoute from './routes/scheduleRoute.js';
import taskRoute from './routes/taskRoute.js';
import notiRoute from './routes/notificationRoute.js';
import timeRoute from './routes/timeRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

mongoose.connect((process.env.MONGODB_URL) , {useUnifiedTopology:true, useNewUrlParser: true})
  .then(() => {
    console.log('Mongo DB Connection successfull')
    app.listen(port, () => console.log(`Node JS server started in port ${port}`))
  }).catch((err) => {
    console.log('Mongo DB Connection Error')
  })
//Cấu hình Express để xử lý dữ liệu lớn, đa dạng
app.use(bodyParser.json({limit:'50mb'}));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

app.use('/api/user', userRoute);
app.use('/api/schedule', scheduleRoute);
app.use('/api/task', taskRoute);
app.use('/api/noti', notiRoute);
app.use('/api/time', timeRoute);
