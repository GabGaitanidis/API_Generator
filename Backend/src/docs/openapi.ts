const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Api Mock Data Backend API",
    version: "1.0.0",
    description:
      "REST API for auth, projects, rules, condition sets, generated URLs, and dynamic mock responses.",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Health", description: "Service health check" },
    { name: "Auth", description: "Authentication and session management" },
    { name: "Projects", description: "Project management" },
    { name: "Rules", description: "Rule CRUD" },
    { name: "Condition Sets", description: "Condition set CRUD" },
    { name: "URLs", description: "Generated URL CRUD" },
    { name: "Dynamic Mock", description: "Mock data generation endpoint" },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "accessToken",
      },
    },
    schemas: {
      MessageResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          status: { type: "integer" },
        },
      },
      AuthUser: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          api_key: { type: "string" },
          role: { type: "string" },
        },
      },
      AuthRegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
        },
      },
      AuthLoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
        },
      },
      Project: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          user_id: { type: "integer" },
        },
      },
      Rule: {
        type: "object",
        properties: {
          id: { type: "integer" },
          version: { type: "string" },
          endpoint: { type: "string" },
          latency: { type: "integer" },
          dataSchema: { type: "object", additionalProperties: true },
          statusCodes: { type: "object", additionalProperties: true },
        },
      },
      ConditionBranch: {
        type: "object",
        properties: {
          if: { type: "object", additionalProperties: { type: "string" } },
          then: { type: "object", additionalProperties: true },
        },
      },
      ConditionSet: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string", nullable: true },
          conditions: {
            type: "array",
            items: { $ref: "#/components/schemas/ConditionBranch" },
          },
        },
      },
      UrlItem: {
        type: "object",
        properties: {
          id: { type: "integer" },
          url: { type: "string" },
          rules_id: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      PaginatedUrlsResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          urls: {
            type: "array",
            items: { $ref: "#/components/schemas/UrlItem" },
          },
          pagination: {
            type: "object",
            properties: {
              page: { type: "integer" },
              limit: { type: "integer" },
              hasNext: { type: "boolean" },
            },
          },
        },
      },
      DynamicMockResponse: {
        type: "object",
        properties: {
          error: { type: "boolean" },
          version: { type: "string" },
          statusCode: { type: "integer" },
          message: { type: "string" },
          latency: { type: "integer" },
          data: { type: "object", additionalProperties: true },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          200: {
            description: "Service is healthy",
          },
        },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthRegisterRequest" },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthLoginRequest" },
            },
          },
        },
        responses: {
          200: { description: "Logged in successfully" },
        },
      },
    },
    "/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refresh JWT session",
        responses: {
          200: { description: "Tokens refreshed" },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout a user",
        responses: {
          200: { description: "Logged out successfully" },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get authenticated user",
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: "Authenticated user" },
        },
      },
    },
    "/projects": {
      get: {
        tags: ["Projects"],
        security: [{ cookieAuth: [] }],
        summary: "List projects",
        responses: {
          200: { description: "Projects fetched" },
        },
      },
      post: {
        tags: ["Projects"],
        security: [{ cookieAuth: [] }],
        summary: "Create a project",
        responses: {
          201: { description: "Project created" },
        },
      },
    },
    "/projects/{projectId}": {
      get: {
        tags: ["Projects"],
        security: [{ cookieAuth: [] }],
        summary: "Get a project by id",
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Project fetched" },
        },
      },
      patch: {
        tags: ["Projects"],
        security: [{ cookieAuth: [] }],
        summary: "Update a project",
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Project updated" },
        },
      },
      delete: {
        tags: ["Projects"],
        security: [{ cookieAuth: [] }],
        summary: "Delete a project",
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Project deleted" },
        },
      },
    },
    "/projects/{projectId}/rules": {
      get: {
        tags: ["Rules"],
        security: [{ cookieAuth: [] }],
        summary: "List rules for a project",
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: { 200: { description: "Rules fetched" } },
      },
      post: {
        tags: ["Rules"],
        security: [{ cookieAuth: [] }],
        summary: "Create a rule",
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: { 201: { description: "Rule created" } },
      },
    },
    "/projects/{projectId}/rules/{version}/{id}": {
      patch: {
        tags: ["Rules"],
        security: [{ cookieAuth: [] }],
        summary: "Update a rule",
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
          {
            name: "version",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: { 200: { description: "Rule updated" } },
      },
      delete: {
        tags: ["Rules"],
        security: [{ cookieAuth: [] }],
        summary: "Delete a rule",
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
          {
            name: "version",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: { 200: { description: "Rule deleted" } },
      },
    },
    "/projects/{projectId}/condition-sets": {
      get: {
        tags: ["Condition Sets"],
        security: [{ cookieAuth: [] }],
        summary: "List condition sets",
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: { 200: { description: "Condition sets fetched" } },
      },
      post: {
        tags: ["Condition Sets"],
        security: [{ cookieAuth: [] }],
        summary: "Create a condition set",
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: { 201: { description: "Condition set created" } },
      },
    },
    "/projects/{projectId}/condition-sets/{conditionSetId}": {
      get: {
        tags: ["Condition Sets"],
        security: [{ cookieAuth: [] }],
        summary: "Get a condition set by id",
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
          {
            name: "conditionSetId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: { 200: { description: "Condition set fetched" } },
      },
      patch: {
        tags: ["Condition Sets"],
        security: [{ cookieAuth: [] }],
        summary: "Update a condition set",
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
          {
            name: "conditionSetId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: { 200: { description: "Condition set updated" } },
      },
      delete: {
        tags: ["Condition Sets"],
        security: [{ cookieAuth: [] }],
        summary: "Delete a condition set",
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
          {
            name: "conditionSetId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: { 200: { description: "Condition set deleted" } },
      },
    },
    "/projects/{projectId}/urls": {
      get: {
        tags: ["URLs"],
        security: [{ cookieAuth: [] }],
        summary: "List generated URLs",
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", default: 5 },
          },
        ],
        responses: { 200: { description: "URLs fetched" } },
      },
    },
    "/projects/{projectId}/urls/{ruleId}": {
      post: {
        tags: ["URLs"],
        security: [{ cookieAuth: [] }],
        summary: "Create a generated URL for a rule",
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
          {
            name: "ruleId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: { 201: { description: "Generated URL created" } },
      },
    },
    "/projects/{projectId}/urls/{id}": {
      patch: {
        tags: ["URLs"],
        security: [{ cookieAuth: [] }],
        summary: "Update a generated URL",
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: { 200: { description: "Generated URL updated" } },
      },
      delete: {
        tags: ["URLs"],
        security: [{ cookieAuth: [] }],
        summary: "Delete a generated URL",
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: { 200: { description: "Generated URL deleted" } },
      },
    },
    "/dynamics/api/mock/{apiKey}/{endpoint}": {
      get: {
        tags: ["Dynamic Mock"],
        summary: "Fetch generated mock data for a URL",
        parameters: [
          {
            name: "apiKey",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "endpoint",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "Generated mock response" } },
      },
    },
  },
} as const;

export default openApiSpec;
