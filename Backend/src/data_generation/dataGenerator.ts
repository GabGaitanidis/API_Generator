import { faker } from "@faker-js/faker";

function dataGenerator(dataSchema: Record<string, string>) {
  const schema = dataSchema;

  const mockData: Record<string, any> = {};

  for (const [key, fakerPath] of Object.entries(schema)) {
    const [moduleName, methodName] = fakerPath.split(".");

    mockData[key] = (faker as any)[moduleName][methodName]();
  }
  return mockData;
}

export default dataGenerator;
