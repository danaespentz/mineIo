// swaggerOptions.js
const swaggerOptions = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "REST API ",
        description: "REST API",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3000/api",
          description: "Development server",
        },
      ],
    },
    apis: ["./routes/*.js"], // Path to the API routes
  };
  
  module.exports = swaggerOptions;
  