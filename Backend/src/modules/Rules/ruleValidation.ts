import { z } from "zod";

const createRuleSchema = z.object({
  endpoint: z.string().min(1).regex(/^\//, "endpoint must start with '/'"),
  dataSchema: z.record(z.string(), z.any()).optional(),
});

export function validateCreateRule(data: any) {
  return createRuleSchema.parse(data);
}
