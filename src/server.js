import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoute from './routes/userRoute.js';
import scheduleRoute from './routes/scheduleRoute.js';
import activitiesRoute from './routes/activitiesRoute.js';
import notiRoute from './routes/notificationRoute.js';
import timeRoute from './routes/timeRoute.js';
import itemScheduleRoute from './routes/itemScheduleRoute.js';
import { timeoutMiddleware } from './middlewares/index.js'

dotenv.config();

const app = express();
const port = process.env.PORT;

mongoose.connect((process.env.MONGODB_URL), { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log('Mongo DB Connection successfull')
    app.listen(port, () => console.log(`Node JS server started in port ${port}`))
  }).catch((err) => {
    console.log('Mongo DB Connection Error')
  })
app.use(timeoutMiddleware(5000));
//Cấu hình Express để xử lý dữ liệu lớn, đa dạng
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));
app.use(cors())

app.use('/v1/api/user', userRoute);
app.use('/v1/api/schedule', scheduleRoute);
app.use('/v1/api/activities', activitiesRoute);
app.use('/v1/api/noti', notiRoute);
app.use('/v1/api/time', timeRoute);
app.use('/v1/api/itemSchedule', itemScheduleRoute);

