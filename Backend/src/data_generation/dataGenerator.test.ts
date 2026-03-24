import { describe, expect, test } from "vitest";
import dataGenerator from "./dataGenerator";

describe("dataGenerator", () => {
  test("generates attributes based on faker schema map", () => {
    const data = dataGenerator({
      firstName: "person.firstName",
      email: "internet.email",
      city: "location.city",
    });

    expect(data).toHaveProperty("firstName");
    expect(data).toHaveProperty("email");
    expect(data).toHaveProperty("city");

    expect(typeof data.firstName).toBe("string");
    expect(typeof data.email).toBe("string");
    expect(typeof data.city).toBe("string");
  });
});
