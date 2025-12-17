import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.routes"
import credentialsRoutes from "./routes/credentials.routes"
import workflowRoutes from "./routes/workflow.routes"
import executionRoutes from "./routes/execution.routes"


const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    credentials: true,
    methods: ["GET","POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
    console.log("hello health check!");
    res.send("healthy")
})

app.use("/api/auth", authRouter);

app.use("/api/workflows", workflowRoutes);

app.use("/api/credentials", credentialsRoutes);

app.use("/api/executions", executionRoutes);


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})