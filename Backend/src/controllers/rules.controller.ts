import { Request, Response } from "express";
import { getRulesByUser } from "../repository/rules.repo";
import createRuleService from "../service/createRuleService";
import { validateCreateRule } from "../validation/ruleValidation";

async function getRulesController(req: Request, res: Response) {
  const userId = Number((req as any).user?.id);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const rules = await getRulesByUser(userId);
  res.status(200).json({ message: "Success", rules });
}

async function createRulesController(req: Request, res: Response) {
  const userId = Number((req as any).user?.id);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { endpoint, dataSchema } = validateCreateRule(req.body);
  const newRule = await createRuleService(
    userId,
    endpoint,
    dataSchema as Record<string, string>,
  );
  res.status(201).json({ message: "Success", newRule });
}
export { getRulesController, createRulesController };
