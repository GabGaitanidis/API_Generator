import type { Request, Response } from "express";
import getDynamicsUrlDataService from "./getDynamicsUrlData.service";

async function getDynamicUrlData(req: Request, res: Response) {
  const rawParams = {
    apiKey: req.params.apiKey,
    endpoint: req.params.endpoint,
  };
  const result = await getDynamicsUrlDataService(rawParams);

  if (!result) {
    return res.status(404).json({ message: "No data for this" });
  }

  const { mockData, latency, errorRate } = result;

  if (errorRate > 0 && Math.random() < errorRate / 100) {
    if (latency > 0) {
      await new Promise((resolve) => setTimeout(resolve, latency));
    }
    return res.status(500).json({ message: "Simulated server error" });
  }

  if (latency > 0) {
    await new Promise((resolve) => setTimeout(resolve, latency));
  }

  return res.status(200).json(mockData);
}

export { getDynamicUrlData };
