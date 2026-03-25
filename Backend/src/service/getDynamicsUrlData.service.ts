import dataGenerator from "../data_generation/dataGenerator";
import { getDynamicsUrlData } from "../repository/dynamicUrl.repo";
import authorizeAPIKey from "./authorizeAPIKey";

async function getDynamicsUrlDataService(
  userId: number,
  apiKey: string,
  endpoint: string,
) {
  const access = await authorizeAPIKey(apiKey, endpoint);

  if (!access) return false;

  const result = await getDynamicsUrlData(userId, endpoint);
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
