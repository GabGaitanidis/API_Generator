import z from "zod";

export const createUrlSchema = z.object({
  ruleId: z.preprocess((val) => Number(val), z.number().int().positive()),
});

export const updateUrlParamsSchema = z.object({
  id: z.preprocess((val) => Number(val), z.number().int().positive()),
});

export const updateUrlBodySchema = z.object({
  url: z.string().url(),
});

export const deleteUrlParamsSchema = z.object({
  id: z.preprocess((val) => Number(val), z.number().int().positive()),
});

export const getUrlQuerySchema = z.object({
  page: z.preprocess(
    (val) => (val === undefined ? 1 : Number(val)),
    z.number().int().positive().default(1),
  ),
  limit: z.preprocess(
    (val) => (val === undefined ? 5 : Number(val)),
    z.number().int().positive().max(50).default(5),
  ),
});
