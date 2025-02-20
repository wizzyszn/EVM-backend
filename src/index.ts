import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { getEnvVar } from "./utils/env";
import dotenv from "dotenv";
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const port = getEnvVar("SERVER_PORT", "5000");
dotenv.config();
import cors from 'cors'
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import estateRouter from "./routes/estate";
import propertyRouter from "./routes/property";
import tenantRouter from "./routes/tenant";
const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "https://evm-8kgl.vercel.app", // Frontend origin
    credentials: true, // Allow cookies or other credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json({ limit: '50mb' }));
//?* MIDDLEWARES
app.use(morgan("dev"));
//?* ROUTES 
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/estates', estateRouter);
app.use('/api/v1/properties', propertyRouter);
app.use('/api/v1/tenants', tenantRouter);

//app.use(authenticate);
//test endpoint
app.get('/testing', (req,res) =>{
  res.send('working')
});

mongoose
  .connect(getEnvVar("MONGODB_URL", "5000"))
  .then(() => {
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  })
  .catch((res) => {
    console.error(res);
  });


  // Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await mongoose.connection.close();
  process.exit(0);
});