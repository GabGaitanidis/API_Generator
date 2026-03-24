import express from "express";
import { requireAuth } from "../middlewares/auth.middleware";

import {
  getRulesController,
  createRulesController,
} from "../controllers/rules.controller";
const ruleRouter = express.Router();

ruleRouter.get("/", requireAuth, getRulesController);
ruleRouter.post("/", requireAuth, createRulesController);
export default ruleRouter;
