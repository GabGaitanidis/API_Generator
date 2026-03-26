import express from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { createUrlRoute, getUrlRoute } from "./url.controller";
import { getDynamicUrlData } from "./dynamicUrl.controller";
import checkUserId from "../../middlewares/checkUserId";

const dynamicRouter = express.Router();

dynamicRouter.get("/", requireAuth, checkUserId, getUrlRoute);
dynamicRouter.post("/:ruleId", requireAuth, checkUserId, createUrlRoute);
dynamicRouter.get("/api/mock/:apiKey/:endpoint", getDynamicUrlData);
// dynamicRouter.get("/api/mock/:apiKey/:endpoint", (req, res) => {
//   console.log("dynamic mock route hit");
//   res.json({ ok: true, params: req.params });
// });
export default dynamicRouter;
