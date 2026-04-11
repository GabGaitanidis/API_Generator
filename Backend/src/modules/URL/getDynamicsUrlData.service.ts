import dataGenerator from "../../data_generation/dataGenerator";
import authorizeAPIKey from "../Auth/authorizeAPIKey";
import normalizeEndpoint from "../../utils/normalizeEndpoint";
import { getDynamicsUrlData } from "./dynamicUrl.repo";
import { validateDynamicApi } from "./dynamicUrl.validation";

async function getDynamicsUrlDataService(params: Object) {
  const { apiKey, endpoint } = validateDynamicApi(params);
  const normalizedEndpoint = normalizeEndpoint(endpoint);

  const access = await authorizeAPIKey(apiKey, normalizedEndpoint);

  if (!access) return false;

  const result = await getDynamicsUrlData(apiKey, normalizedEndpoint);
  if (!result || !result.length) {
    return null;
  }

  const schema = result[0].dataSchema;
  const latency = result[0].latency || 0;
  const errorRate = result[0].errorRate || 0;
  if (!schema || typeof schema !== "object") {
    return null;
  }

  const mockData = dataGenerator(schema);
  return { mockData, latency, errorRate };
}

export default getDynamicsUrlDataService;
