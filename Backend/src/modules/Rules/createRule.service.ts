import { getUsersAPIKey } from "../User/user.repo";
import { createRule } from "./rules.repo";
import { validateCreateRule } from "./ruleValidation";

async function createRuleService(userId: number, body: any) {
  const { endpoint, dataSchema } = validateCreateRule(body);
  const apiKey = await getUsersAPIKey(userId);
  console.log(apiKey);
  const rule = await createRule(userId, endpoint, dataSchema, apiKey);

  return { rule };
}

export default createRuleService;
