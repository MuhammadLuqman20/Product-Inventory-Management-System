import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import categoryRoutes from "./routes/categoryRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import stockMovementRoutes from "./routes/stockMovementRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";



import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(morgan("dev"));
app.use(express.json());


// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/products", productRoutes);


const distPath = path.join(__dirname, "../../frontend/dist");
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
} else {
    app.get("/", (req, res) => {
        res.status(200).json({
            message: "Product Inventory API is running"
        });
    });
}


app.use(
    "/api",
    stockMovementRoutes
);
app.use("/api/auth", authRoutes);

if (fs.existsSync(distPath)) {
    app.get("/*splat", (req, res, next) => {
        if (req.url.startsWith("/api")) {
            return next();
        }
        res.sendFile(path.join(distPath, "index.html"));
    });
}

app.use(errorMiddleware);

export default app;