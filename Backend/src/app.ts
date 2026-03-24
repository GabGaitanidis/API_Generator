import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";
import urlRouter from "./routes/rules.route";
import dynamicRouter from "./routes/dynamic.route";
import authRouter from "./routes/auth.routes";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/rule", urlRouter);
app.use("/dynamic", dynamicRouter);
app.get("/health", (req, res) => {
  res.send("Server good");
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
