import express from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { createUrlRoute, getUrlRoute } from "../controllers/url.controller";
import { getDynamicUrlData } from "../controllers/dynamicUrl.controller";

const dynamicRouter = express.Router();

dynamicRouter.get("/", requireAuth, getUrlRoute);
dynamicRouter.post("/:ruleId", requireAuth, createUrlRoute);
dynamicRouter.get(
  "/api/mock/:apiKey/:endpoint",
  requireAuth,
  getDynamicUrlData,
);

export default dynamicRouter;
