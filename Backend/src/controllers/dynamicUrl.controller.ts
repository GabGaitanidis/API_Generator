import type { Request, Response } from "express";
validateDynamicApi;
import { validateDynamicApi } from "../validation/dynamicUrlValidation";
import getDynamicsUrlDataService from "../service/getDynamicsUrlData.service";
import normalizeEndpoint from "../service/normalizeEndpoint";

function getUserId(req: Request): number {
  const userId = Number(req.user?.id);

  if (!userId) {
    const error = new Error("Unauthorized");
    (error as any).statusCode = 401;
    throw error;
  }

  return userId;
}

function extractDynamicUrlParams(req: Request): {
  apiKey: string;
  endpoint: string;
} {
  const apiKeyParam = req.params.apiKey;
  const endpointEncoded = req.params.endpoint;

  if (!apiKeyParam || !endpointEncoded) {
    const error = new Error("Invalid API key or endpoint");
    (error as any).statusCode = 400;
    throw error;
  }

  let endpointParam = endpointEncoded;

  endpointParam = decodeURIComponent(endpointEncoded as string);

  return {
    apiKey: apiKeyParam as string,
    endpoint: endpointParam,
  };
}

async function getDynamicUrlData(req: Request, res: Response) {
  try {
    const userId = getUserId(req);

    const rawParams = extractDynamicUrlParams(req);

    const { apiKey, endpoint } = validateDynamicApi(rawParams);

    const normalizedEndpoint = normalizeEndpoint(endpoint);

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

    return res.status(200).json(mockData);
  } catch (error: any) {
    const statusCode = error?.statusCode || 500;
    const message = error?.message || "Internal server error";

    return res.status(statusCode).json({ message });
  }
}

export { getDynamicUrlData };
