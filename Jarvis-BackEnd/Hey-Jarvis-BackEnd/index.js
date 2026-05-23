// import express from 'express';
// import dotenv from "dotenv";
// import cors from 'cors';
// import DbConnect from './DbConnect.js';
// import redisClient from './utils/redisClient.js';
// import cookieParser from "cookie-parser";



// //Routes
// import UploadPhotoRoute from './routes/UploadPhotoRoute.js';
// import SaveLivePhotos from './routes/SaveLivePhotos.js';
// import LivePhotoVerfication from './routes/LivePhotoVerification.js';
// import { SaveAccountability } from './routes/SaveAccountability.js';
// import { SaveAll } from './routes/SaveAll.js';
// import { GetAll } from './routes/GetAll.js';
// import { GetTodoCollision } from './routes/GetTodoCollision.js';
// import { StrictMode } from './routes/StrictMode.js';
// import GenerateEventsRoute from './routes/GenerateEvents.js';
// import AuthRoutes from './routes/authRoutes.js';
// import calendarRoutes from "./routes/calendarRoutes.js";
// import userRoutes from './routes/userRoute.js';
// import payment from './routes/paymentRoute.js';
// import randomised from './routes/RandomisedRoute.js'
// import PositionsRoutes from './routes/positionRoute.js';

// //Middlewares
// import { createStrictModeFilter } from './middlewares/strictMode.middleware.js';
// import { protect } from './middlewares/authMiddleware.js';
// import { DateTime } from 'luxon';

// // import { initInternalWebSocketServer } from './wsServerInternal.js';

// const indiaTime = DateTime.now().setZone('Asia/Kolkata');
// console.log(' Current time in India:', indiaTime.toFormat("EEE, dd MMM yyyy hh:mm:ss a"));

// // await redisClient.set('test-key', 'hello-jarvis');
// // const value = await redisClient.get('test-key');
// // console.log(' Redis Value:', value);

// const resp = await DbConnect();
// const app = express();
// dotenv.config();
// app.use(cors({
//   origin: [
//     "http://13.51.56.30",
//     "http://localhost:5173",
//     "https://hey-jarvis-front-end.vercel.app"
//   ],
//   credentials: true,
// }));

// app.use(express.json({ limit: '30mb' }));
// app.use(cookieParser());

// app.use('/api/auth', AuthRoutes); //  enables POST /api/auth/login
// app.use('/api', UploadPhotoRoute);

// app.use('/apiLivePhotoVerfication', LivePhotoVerfication);
// app.use('/GetAll', GetAll)
// app.use('/GetTodoCollision', GetTodoCollision)
// app.use('/SetStrictMode', StrictMode)

// app.use('/apiPositions', PositionsRoutes);
// app.use('/apiPhotos', createStrictModeFilter, SaveLivePhotos);
// app.use('/apiAccountability', createStrictModeFilter, SaveAccountability);
// app.use('/SaveAll', createStrictModeFilter, SaveAll);
// app.use('/payment', payment);
// app.use('/randomised', randomised)


// app.use('/apiGenerateEvents', GenerateEventsRoute);
// app.use("/calendar", calendarRoutes);
// app.use('/api/user', userRoutes);

// const PORT = 3000;

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on http://${process.env.HOST || '0.0.0.0'}:${PORT}`);
// });





import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import DbConnect from './DbConnect.js';
import redisClient from './utils/redisClient.js';
import cookieParser from "cookie-parser";
import { DateTime } from 'luxon';

// Models
import CrashMarker from './models/CrashMarker.js';
import { sendCrashMail } from './utils/ScheduleComponents/Notifications/CrashNotifier.js';

// Routes
import UploadPhotoRoute from './routes/UploadPhotoRoute.js';
import SaveLivePhotos from './routes/SaveLivePhotos.js';
import LivePhotoVerfication from './routes/LivePhotoVerification.js';
import { SaveAccountability } from './routes/SaveAccountability.js';
import { SaveAll } from './routes/SaveAll.js';
import { GetAll } from './routes/GetAll.js';
import { GetTodoCollision } from './routes/GetTodoCollision.js';
import { StrictMode } from './routes/StrictMode.js';
import GenerateEventsRoute from './routes/GenerateEvents.js';
import AuthRoutes from './routes/authRoutes.js';
import calendarRoutes from "./routes/calendarRoutes.js";
import userRoutes from './routes/userRoute.js';
import payment from './routes/paymentRoute.js';
import randomised from './routes/RandomisedRoute.js';
import PositionsRoutes from './routes/positionRoute.js';
import captchaRoutes from "./routes/captchaRoute.js";


// Middlewares
import { createStrictModeFilter } from './middlewares/strictMode.middleware.js';
import { protect } from './middlewares/authMiddleware.js';

// Crash Marker Helpers
async function recordBoot(serviceName) {
  const existing = await CrashMarker.findOne({ name: serviceName });

  if (existing) {
    console.warn(`Crash detected: ${serviceName} had leftover marker from last run.`);

    // Flush all Redis keys on crash
    await redisClient.flushAll();
    console.log("Redis fully flushed — all keys removed.");
    // Send crash email
    await sendCrashMail();
  }

  await CrashMarker.updateOne(
    { name: serviceName },
    { startedAt: new Date() },
    { upsert: true }
  );

  console.log(`${serviceName} boot recorded.`);
}

async function recordShutdown(serviceName) {
  await CrashMarker.deleteOne({ name: serviceName });
  console.log(`Clean shutdown recorded for ${serviceName}`);
}

// Startup
dotenv.config();
const indiaTime = DateTime.now().setZone('Asia/Kolkata');
console.log('Current time in India:', indiaTime.toFormat("EEE, dd MMM yyyy hh:mm:ss a"));

await DbConnect();
await recordBoot("main-server");

const app = express();
// app.use(cors({
//   origin: [
//     "http://13.51.56.30",
//     "http://localhost:5173",
//     "https://hey-jarvis-front-end.vercel.app"
//   ],
//   credentials: true,
// }));

// Parse CORS origins from env
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json({ limit: '30mb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', AuthRoutes);
app.use('/api', UploadPhotoRoute);

app.use('/apiLivePhotoVerfication', LivePhotoVerfication);
app.use('/GetAll', GetAll);
app.use('/GetTodoCollision', GetTodoCollision);
app.use('/SetStrictMode', StrictMode);

app.use('/apiPositions', PositionsRoutes);
app.use('/apiPhotos', createStrictModeFilter, SaveLivePhotos);
app.use('/apiAccountability', createStrictModeFilter, SaveAccountability);
app.use('/SaveAll', createStrictModeFilter, SaveAll);
app.use('/payment', payment);
app.use('/randomised', randomised);

app.use('/apiGenerateEvents', GenerateEventsRoute);
app.use("/calendar", calendarRoutes);
app.use('/api/user', userRoutes);
app.use("/captcha", captchaRoutes);


// Start server
const PORT = 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://${process.env.HOST || '0.0.0.0'}:${PORT}`);
});

// Shutdown hooks
process.on("SIGINT", async () => {
  await recordShutdown("main-server");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await recordShutdown("main-server");
  process.exit(0);
});




