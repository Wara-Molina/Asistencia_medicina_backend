// src/docs/swagger.ts

import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Sistema Asistencia Medicina API",

      version: "1.0.0",

      description: "Backend institucional Facultad de Medicina",
    },

    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://sistema-asistencia-api-3cjq.onrender.com/api"
            : "http://localhost:3000/api",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",

          scheme: "bearer",

          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
