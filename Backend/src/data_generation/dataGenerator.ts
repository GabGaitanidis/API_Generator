import { faker } from "@faker-js/faker";
import parseCondition from "./conditionEngine";

const UNRESOLVED_PATH = Symbol("UNRESOLVED_PATH");

function resolveFakerPath(path: string) {
  const parts = path.split(".");

  let current: any = faker;
  let parent: any = null;

  for (const part of parts) {
    if (current == null || !(part in current)) {
      return UNRESOLVED_PATH;
    }

    parent = current;
    current = current[part];
  }

  if (typeof current === "function") {
    return current.call(parent);
  }

  return current;
}

function resolveSchemaValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => resolveSchemaValue(item));
  }

  if (value && typeof value === "object") {
    const resolvedObject: Record<string, unknown> = {};

    for (const [key, nestedValue] of Object.entries(value)) {
      resolvedObject[key] = resolveSchemaValue(nestedValue);
    }

    return resolvedObject;
  }

  if (typeof value === "string") {
    const resolved = resolveFakerPath(value);

    if (resolved === UNRESOLVED_PATH) {
      return value;
    }

    return resolved;
  }

  return value;
}

function dataGenerator(dataSchema: Record<string, unknown>) {
  const mockData: Record<string, unknown> = {};
  let mockDataResult: object;
  for (const [key, schemaValue] of Object.entries(dataSchema)) {
    if (key !== "conditions") {
      mockData[key] = resolveSchemaValue(schemaValue);
    }
  }
  mockDataResult = { ...mockData };
  if (Array.isArray(dataSchema.conditions)) {
    for (const condition of dataSchema.conditions) {
      const result = parseCondition(mockData, condition.if, condition.then);
      if (result) {
        mockDataResult = { ...mockDataResult, ...condition.then };
      }
    }
  }
  return mockDataResult;
}

export default dataGenerator;
