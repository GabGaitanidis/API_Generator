import { Request, Response } from "express";
import { z } from "zod";
import createDynamicUrlService from "../service/createDynamicUrl";
import getDynamicUrlService from "../service/getDynamicUrl";

const createUrlSchema = z.object({
  ruleId: z.preprocess((val) => Number(val), z.number().int().positive()),
});

async function createUrlRoute(req: Request, res: Response) {
  const validation = createUrlSchema.safeParse(req.params);
  if (!validation.success) {
    return res.status(400).json({
      message: "Invalid rule ID",
      errors: validation.error.format(),
    });
  }

  const userId = Number((req as any).user?.id);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const url = await createDynamicUrlService(userId, validation.data.ruleId);
  res.status(201).json(url);
}

async function getUrlRoute(req: Request, res: Response) {
  const userId = Number((req as any).user?.id);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const urls = await getDynamicUrlService(userId);
  res.status(200).json(urls);
}

export { createUrlRoute, getUrlRoute };
