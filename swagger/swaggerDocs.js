const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

function swaggerDocs(app) {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, { explorer: true })
  );
  console.log(`swagger is at http://localhost:${process.env.PORT}/api-docs`);
}

module.exports = swaggerDocs;
