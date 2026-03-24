const API_HOST = "http://localhost:5000/dynamic/api/mock"; // env host var

function urlGenerator(apiKey: string, endpoint: string) {
  const url = API_HOST + `/${apiKey}${endpoint}`;
  return url;
}

export default urlGenerator;
