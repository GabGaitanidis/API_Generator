import dataGenerator from "../../data_generation/dataGenerator";
import authorizeAPIKey from "../Auth/authorizeAPIKey";
import normalizeEndpoint from "../../service/normalizeEndpoint";
import { getDynamicsUrlData } from "./dynamicUrl.repo";
import { validateDynamicApi } from "./dynamicUrlValidation";

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
  if (!schema || typeof schema !== "object") {
    return null;
  }

  return dataGenerator(schema);
}

export default getDynamicsUrlDataService;
