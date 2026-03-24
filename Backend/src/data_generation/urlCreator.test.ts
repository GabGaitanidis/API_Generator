import { describe, expect, test } from "vitest";
import urlCreator from "./urlCreator";

describe("urlCreator", () => {
  test("builds expected mock API URL from inputs", () => {
    const url = urlCreator(10, "ABC123", "/users");
    expect(url).toBe("http://localhost:5000/api/mock/10/ABC123/users");
  });
});
