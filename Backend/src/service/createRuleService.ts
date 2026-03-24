import { createRule } from "../repository/rules.repo";

async function createRuleService(
  userId: number,
  endpoint: string,
  dataSchema: Record<string, string>,
  url_id?: number,
) {
  const rule = await createRule(userId, endpoint, dataSchema, url_id);
  return rule;
}

export default createRuleService;
