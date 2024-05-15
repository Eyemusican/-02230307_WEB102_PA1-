const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PRODUCTS_FILE = path.join(__dirname, 'products.json');

const server = http.createServer((req, res) => {
  const { method, url } = req;

  try {
    if (method === 'GET' && url === '/products') {
      // GET /products: Retrieve a list of all products
      const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(products));
    } else if (method === 'GET' && url.startsWith('/products/')) {
      // GET /products/:id: Retrieve a specific product by its ID
      const id = parseInt(url.split('/')[2], 10);
      const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
      const product = products.find(p => p.id === id);

      if (product) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(product));
      } else {
        res.statusCode = 404;
        res.end(`Product with ID ${id} not found`);
      }
    } else if (method === 'POST' && url === '/products') {
      // POST /products: Create a new product
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const newProduct = JSON.parse(body);
        const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
        newProduct.id = products.length + 1;
        products.push(newProduct);

        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));

        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(newProduct));
      });
    } else if (method === 'PUT' && url.startsWith('/products/')) {
      // PUT /products/:id: Update an existing product by its ID
      const id = parseInt(url.split('/')[2], 10);
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const updatedProduct = JSON.parse(body);
        const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
        const index = products.findIndex(p => p.id === id);

        if (index !== -1) {
          products[index] = { ...updatedProduct, id };
          fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(updatedProduct));
        } else {
          res.statusCode = 404;
          res.end(`Product with ID ${id} not found`);
        }
      });
    } else if (method === 'PATCH' && url.startsWith('/products/')) {
      // PATCH /products/:id: Partial update of an existing product by its ID
      const id = parseInt(url.split('/')[2], 10);
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const updatedFields = JSON.parse(body);
        const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
        const index = products.findIndex(p => p.id === id);

        if (index !== -1) {
          const updatedProduct = { ...products[index], ...updatedFields };
          products[index] = updatedProduct;
          fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(updatedProduct));
        } else {
          res.statusCode = 404;
          res.end(`Product with ID ${id} not found`);
        }
      });
    } else if (method === 'DELETE' && url.startsWith('/products/')) {
      // DELETE /products/:id: Delete a product by its ID
      const id = parseInt(url.split('/')[2], 10);
      const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
      const index = products.findIndex(p => p.id === id);

      if (index !== -1) {
        products.splice(index, 1);
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
        res.statusCode = 200;
        res.end(`Product with ID ${id} deleted successfully`);
      } else {
        res.statusCode = 404;
        res.end(`Product with ID ${id} not found`);
      }
    } else {
      res.statusCode = 404;
      res.end('Not found');
    }
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  } finally {
    // Clean up resources here
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});