import { z } from "zod";

const dynamicApiSchema = z.object({
  apiKey: z.string().min(1).nonempty(),
  endpoint: z.string().min(1).nonempty(),
});

export function validateDynamicApi(data: any) {
  return dynamicApiSchema.parse(data);
}
