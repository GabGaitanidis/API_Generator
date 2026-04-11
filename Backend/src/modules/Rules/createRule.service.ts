import { getUsersAPIKey } from "../User/user.repo";
import { createRule } from "./rules.repo";
import { validateCreateRule } from "./rule.validation";

async function createRuleService(userId: number, body: any) {
  const { endpoint, dataSchema, latency, errorRate } = validateCreateRule(body);
  const apiKey = await getUsersAPIKey(userId);
  console.log(apiKey);
  const rule = await createRule(
    userId,
    endpoint,
    dataSchema,
    apiKey,
    latency,
    errorRate,
  );

  return { rule };
}

export default createRuleService;
