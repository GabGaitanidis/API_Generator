import { z } from "zod";

const createRuleSchema = z.object({
  endpoint: z.string().min(1).regex(/^\//, "endpoint must start with '/'"),
  dataSchema: z.record(z.string(), z.any()).optional(),
  latency: z.number().int().min(0).max(30000).optional().default(0),
  errorRate: z.number().int().min(0).max(100).optional().default(0),
});

export function validateCreateRule(data: any) {
  return createRuleSchema.parse(data);
}
