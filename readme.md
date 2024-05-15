### Web102_CAP01: RESTful API with Node.js Standard Libraries
---
This is a practical assignment to build a RESTful API using only the Node.js Standard Libraries. The API supports CRUD (Create, Read, Update, Delete) operations for a resource of "products"(contain json files).

#### Technologies Used

1. Node.js

2. HTTP module

3. FS module


4. Path module


#### How to run the projects
To run this project locally, follow these steps:

1. Clone the repository or download the source code from here.
2. Open a terminal and navigate to the project directory.
3. Run npm install to install the required dependencies.
4. Run npm start  or run node server.js to start the server(optional).

#### API Endpoints
The following endpoints are available:

1. GET /products: Retrieve a list of all products.
2. GET /products/id: Retrieve a specific product by its ID.
3. POST /products: Create a new product.
4. PUT /products/id: Update an existing product by its ID.
5. PATCH /products/id: Partial update of an existing product by its ID.
6. DELETE /products/id: Delete a product by its ID.

#### Data Storage
The product data is stored in a JSON file (products.json) located in the project directory. 

The fs module from the Node.js Standard Libraries is used to read and write data to this JSON file.

#### Request/Response Format
The API returns data in JSON format. For POST, PUT, and PATCH requests, the request body should is in JSON format.

#### Error Handling
The API handles errors and sends appropriate status codes and error messages in case of  invalid requests.
