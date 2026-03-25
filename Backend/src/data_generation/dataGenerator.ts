import { faker } from "@faker-js/faker";

type FakerModule = keyof typeof faker;

function dataGenerator(dataSchema: Record<string, string>) {
  const mockData: Record<string, any> = {};

  for (const [key, fakerPath] of Object.entries(dataSchema)) {
    const [moduleName, methodName] = fakerPath.split(".") as [
      FakerModule,
      string,
    ];

    const module = faker[moduleName] as Record<string, any>;
    const method = module[methodName];

    if (typeof method === "function") {
      mockData[key] = method();
    } else {
      mockData[key] = method;
    }
  }

  return mockData;
}

export default dataGenerator;
