function normalizeEndpoint(endpoint: string): string {
  if (!endpoint.startsWith("/")) {
    return `/${endpoint}`;
  }

  return endpoint;
}

export default normalizeEndpoint;
