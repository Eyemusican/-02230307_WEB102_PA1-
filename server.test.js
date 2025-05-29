const fs = require('fs');
const path = require('path');

// Simple tests that don't require server to be running
describe('Products API Setup', () => {
  const productsFile = path.join(__dirname, 'products.json');
  
  beforeAll(() => {
    // Ensure products.json exists for tests
    if (!fs.existsSync(productsFile)) {
      const testProducts = [
        { id: 1, name: 'Test Product 1', price: 10.99, description: 'Test description 1' },
        { id: 2, name: 'Test Product 2', price: 20.99, description: 'Test description 2' }
      ];
      fs.writeFileSync(productsFile, JSON.stringify(testProducts, null, 2));
    }
  });

  test('should have server.js file', () => {
    expect(fs.existsSync(path.join(__dirname, 'server.js'))).toBe(true);
  });

  test('should have products.json file', () => {
    expect(fs.existsSync(productsFile)).toBe(true);
  });

  test('should be able to read products.json', () => {
    const products = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  test('should have valid product structure', () => {
    const products = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
    const product = products[0];
    
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
    expect(typeof product.id).toBe('number');
    expect(typeof product.name).toBe('string');
    expect(typeof product.price).toBe('number');
  });

  test('should be able to require server.js without errors', () => {
    expect(() => {
      require('./server.js');
    }).not.toThrow();
  });
});