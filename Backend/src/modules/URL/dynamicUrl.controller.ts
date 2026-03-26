import type { Request, Response } from "express";
import getDynamicsUrlDataService from "./getDynamicsUrlDataService";

async function getDynamicUrlData(req: Request, res: Response) {
  const rawParams = {
    apiKey: req.params.apiKey,
    endpoint: req.params.endpoint,
  };
  const mockData = await getDynamicsUrlDataService(rawParams);

  if (!mockData) {
    return res.status(404).json({ message: "No data for this" });
  }

  return res.status(200).json(mockData);
}

export { getDynamicUrlData };
