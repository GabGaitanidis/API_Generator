import { Request, Response } from "express";
import { validateDynamicApi } from "../validation/dynamicUrlValidation";
import getDynamicsUrlDataService from "../service/getDynamicsUrlData.service";

async function getDynamicUrlData(req: Request, res: Response) {
  const userId = Number((req as any).user?.id);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const apiKeyParam = req.params.apiKey;
  const endpointEncoded = req.params.endpoint;

  if (!apiKeyParam || !endpointEncoded) {
    return res.status(400).json({ message: "Invalid API key or endpoint" });
  }

  let endpointParam = endpointEncoded;
  try {
    endpointParam = decodeURIComponent(endpointParam as string);
  } catch {}

  const params = { apiKey: apiKeyParam, endpoint: endpointParam };

  const { apiKey, endpoint } = validateDynamicApi(params);

  let normalizedEndpoint = endpoint;
  if (!normalizedEndpoint.startsWith("/")) {
    normalizedEndpoint = "/" + normalizedEndpoint;
  }

  const mockData = await getDynamicsUrlDataService(
    userId,
    apiKey,
    normalizedEndpoint,
  );

  if (!mockData) {
    return res
      .status(404)
      .json({ message: "No mock data mapping for this endpoint/user" });
  }

  res.status(200).json(mockData);
}

export { getDynamicUrlData };
