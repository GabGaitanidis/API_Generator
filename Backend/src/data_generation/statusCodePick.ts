export default function pickRandomStatusCode(
  statusCodes: Record<string, number>,
): number {
  const random = Math.random() * 100;
  let cumulativeWeight = 0;

  for (const [code, weight] of Object.entries(statusCodes)) {
    cumulativeWeight += weight;

    if (random <= cumulativeWeight) {
      return Number(code);
    }
  }

  return Number(Object.keys(statusCodes)[0]);
}
// Weighted Random Selection Algorithm
