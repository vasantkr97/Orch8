import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.routes"
import credentialsRoutes from "./routes/credentials.routes"
import workflowRoutes from "./routes/workflow.routes"
import executionRoutes from "./routes/execution.routes"


const PORT = process.env.PORT || 3001;

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204
}))

app.use(express.json());
app.use(cookieParser());


app.get("/", (_, res) => {
    console.log("hello health check!");
    res.send("healthy")
})

app.use("/auth", authRouter);

app.use("/workflows", workflowRoutes);

app.use("/credentials", credentialsRoutes);

app.use("/executions", executionRoutes);


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})