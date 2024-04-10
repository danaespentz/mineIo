const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./swaggerOptions'); // Path to the Swagger configuration file

const app = express();

const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Your existing middleware and route setup goes here

const routes = require('./routes/routes');
app.use('/api', routes);

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
});