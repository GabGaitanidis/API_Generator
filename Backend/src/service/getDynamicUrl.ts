import { getDynamicUrl } from "../repository/url.repo";

async function getDynamicUrlService(userId: number) {
  const url = await getDynamicUrl(userId);
  const urlString = url.map((u) => u.url);
  return urlString;
}

export default getDynamicUrlService;
