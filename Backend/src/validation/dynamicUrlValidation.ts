import { z } from "zod";

const dynamicApiSchema = z.object({
  apiKey: z.string().min(1),
  endpoint: z.string().min(1),
});

export function validateDynamicApi(data: any) {
  return dynamicApiSchema.parse(data);
}
