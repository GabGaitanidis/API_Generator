import { describe, expect, it, vi } from "vitest";
import pickRandomStatusCode from "./statusCodePick";

describe("pickRandomStatusCode", () => {
  describe("Single Status Code", () => {
    it("should return the only status code when only one is provided", () => {
      const statusCodes = { "200": 100 };
      const result = pickRandomStatusCode(statusCodes);
      expect(result).toBe(200);
    });

    it("should always return 200 with 100% weight", () => {
      const statusCodes = { "200": 100 };
      for (let i = 0; i < 10; i++) {
        const result = pickRandomStatusCode(statusCodes);
        expect(result).toBe(200);
      }
    });
  });

  describe("Multiple Status Codes", () => {
    it("should return a status code that exists in the input object", () => {
      const statusCodes = { "200": 50, "201": 30, "400": 20 };
      const validCodes = [200, 201, 400];

      for (let i = 0; i < 20; i++) {
        const result = pickRandomStatusCode(statusCodes);
        expect(validCodes).toContain(result);
      }
    });

    it("should return correct type (number)", () => {
      const statusCodes = { "200": 80, "500": 20 };
      const result = pickRandomStatusCode(statusCodes);
      expect(typeof result).toBe("number");
    });
  });

  describe("Weight Distribution", () => {
    it("should respect weighted distribution (80/20 split)", () => {
      const statusCodes = { "200": 80, "500": 20 };
      const results = {
        200: 0,
        500: 0,
      };

      // Run 1000 times to get statistical significance
      const iterations = 1000;
      for (let i = 0; i < iterations; i++) {
        const result = pickRandomStatusCode(statusCodes);
        if (result === 200) results[200]++;
        else if (result === 500) results[500]++;
      }

      const ratio200 = (results[200] / iterations) * 100;
      const ratio500 = (results[500] / iterations) * 100;

      // Allow 10% margin of error due to randomness
      expect(ratio200).toBeGreaterThan(70);
      expect(ratio200).toBeLessThan(90);
      expect(ratio500).toBeGreaterThan(10);
      expect(ratio500).toBeLessThan(30);
    });

    it("should handle equal weight distribution", () => {
      const statusCodes = { "200": 25, "201": 25, "400": 25, "500": 25 };
      const results = { 200: 0, 201: 0, 400: 0, 500: 0 };

      const iterations = 1000;
      for (let i = 0; i < iterations; i++) {
        const result = pickRandomStatusCode(statusCodes);
        results[result as keyof typeof results]++;
      }

      // Each should get roughly 25%
      Object.values(results).forEach((count) => {
        const percentage = (count / iterations) * 100;
        expect(percentage).toBeGreaterThan(15);
        expect(percentage).toBeLessThan(35);
      });
    });

    it("should handle skewed distribution (90/5/5)", () => {
      const statusCodes = { "200": 90, "404": 5, "500": 5 };
      const results = { 200: 0, 404: 0, 500: 0 };

      const iterations = 1000;
      for (let i = 0; i < iterations; i++) {
        const result = pickRandomStatusCode(statusCodes);
        if (result === 200) results[200]++;
        else if (result === 404) results[404]++;
        else if (result === 500) results[500]++;
      }

      const ratio200 = (results[200] / iterations) * 100;
      expect(ratio200).toBeGreaterThan(80);
      expect(ratio200).toBeLessThan(100);
    });
  });

  describe("Edge Cases", () => {
    it("should handle many status codes", () => {
      const statusCodes: Record<string, number> = {};
      for (let i = 200; i <= 599; i += 10) {
        statusCodes[String(i)] = 1;
      }

      const result = pickRandomStatusCode(statusCodes);
      expect(Object.keys(statusCodes).map(Number)).toContain(result);
    });

    it("should handle very small weights", () => {
      const statusCodes = { "200": 99.9, "500": 0.1 };
      const results = { 200: 0, 500: 0 };

      const iterations = 10000;
      for (let i = 0; i < iterations; i++) {
        const result = pickRandomStatusCode(statusCodes);
        if (result === 200) results[200]++;
        else if (result === 500) results[500]++;
      }

      // 200 should appear much more frequently
      expect(results[200]).toBeGreaterThan(results[500]);
    });
  });

  describe("Common HTTP Status Codes", () => {
    it("should work with realistic API response codes", () => {
      const statusCodes = {
        "200": 85, // OK
        "201": 5, // Created
        "400": 5, // Bad Request
        "401": 2, // Unauthorized
        "500": 3, // Internal Server Error
      };

      const validCodes = [200, 201, 400, 401, 500];
      for (let i = 0; i < 50; i++) {
        const result = pickRandomStatusCode(statusCodes);
        expect(validCodes).toContain(result);
      }
    });

    it("should work with 2xx success codes", () => {
      const statusCodes = {
        "200": 70, // OK
        "201": 20, // Created
        "202": 10, // Accepted
      };

      for (let i = 0; i < 30; i++) {
        const result = pickRandomStatusCode(statusCodes);
        expect([200, 201, 202]).toContain(result);
      }
    });

    it("should work with 4xx client error codes", () => {
      const statusCodes = {
        "400": 40, // Bad Request
        "401": 30, // Unauthorized
        "403": 15, // Forbidden
        "404": 15, // Not Found
      };

      for (let i = 0; i < 30; i++) {
        const result = pickRandomStatusCode(statusCodes);
        expect([400, 401, 403, 404]).toContain(result);
      }
    });

    it("should work with 5xx server error codes", () => {
      const statusCodes = {
        "500": 50, // Internal Server Error
        "502": 30, // Bad Gateway
        "503": 20, // Service Unavailable
      };

      for (let i = 0; i < 30; i++) {
        const result = pickRandomStatusCode(statusCodes);
        expect([500, 502, 503]).toContain(result);
      }
    });
  });

  describe("Type Safety", () => {
    it("should accept string keys and return numbers", () => {
      const statusCodes = { "404": 100 };
      const result = pickRandomStatusCode(statusCodes);
      expect(typeof result).toBe("number");
      expect(result).toBe(404);
    });

    it("should handle numeric status codes correctly", () => {
      const statusCodes = {
        "200": 50,
        "400": 30,
        "500": 20,
      };

      const result = pickRandomStatusCode(statusCodes);
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(200);
      expect(result).toBeLessThanOrEqual(599);
    });
  });
});
