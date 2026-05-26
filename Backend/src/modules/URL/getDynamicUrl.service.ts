import { getDynamicUrl } from "./url.repo";

type PaginationResult = {
  urls: Array<Record<string, unknown>>;
  page: number;
  limit: number;
  hasNext: boolean;
};

type GetDynamicUrlServiceParams = {
  userId: number;
  projectId: number;
  page?: number;
  limit?: number;
};

async function getDynamicUrlService({
  userId,
  projectId,
  page = 1,
  limit = 5,
}: GetDynamicUrlServiceParams): Promise<PaginationResult> {
  const result = await getDynamicUrl(userId, projectId, page, limit);

  return result;
}

export default getDynamicUrlService;
