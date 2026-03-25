import { describe, expect, test } from "vitest";
import urlCreator from "./urlCreator";

describe("urlCreator", () => {
  test("builds expected mock API URL from inputs", () => {
    const url = urlCreator("ABC123", "/products");
    expect(url).toBe("http://localhost:5000/dynamic/api/mock/ABC123/products");
  });
});
