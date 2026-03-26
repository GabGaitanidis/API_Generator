import { faker } from "@faker-js/faker";

function dataGenerator(dataSchema: Record<string, string>) {
  const mockData: Record<string, any> = {};

  for (const [key, fakerPath] of Object.entries(dataSchema)) {
    const parts = fakerPath.split(".");

    let current: any = faker;
    let parent: any = null;

    for (const part of parts) {
      parent = current;
      current = current[part];
    }

    if (typeof current === "function") {
      mockData[key] = current.call(parent);
    } else {
      mockData[key] = current;
    }
  }

  return mockData;
}

export default dataGenerator;
