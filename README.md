```
███████╗███████╗██╗   ██╗███████╗██╗   ██╗
██╔════╝██╔════╝██║   ██║██╔════╝██║   ██║
█████╗  ███████╗██║   ██║███████╗██║   ██║
██╔══╝  ╚════██║██║   ██║╚════██║██║   ██║
███████╗███████║╚██████╔╝███████║╚██████╔╝
╚══════╝╚══════╝ ╚═════╝ ╚══════╝ ╚═════╝ 
 ```

## ER Diagram
---
                                 +------------+
                                 | Property   |
                                 | Manager    |
                                 +------------+
                                 | id         |
                                 | name       |
                                 +------------+
                                           1  *
                                 +------------+
                                 | Property   |
                                 +------------+
                                 | id         |
                                 | address    |
                                 | name       |
                                 +------------+
                                           1  *
                                            |
                                 +------------+
                                 | Apartment  |
                                 +------------+
                                 | id         |
                                 | unit_number|
                                 +------------+
                                           1  *
                                            |
                                 +------------+
                                 | Tenant     |
                                 +------------+
                                 | id         |
                                 | first_name |
                                 | last_name  |
                                 | dob        |
                                 | ssn        |
                                 | primary    |
                                 +------------+
                                           1  *
                                            |
                                 +------------+
                                 | Payment    |
                                 +------------+
                                 | id         |
                                 | date       |
                                 | amount     |
                                 +------------+
                 
                           
## Setup
---
_Tested successfully using node v18.13.0 and npm 8.19.3_

Create a **.env** file, using **.env.example** for reference

The `ORIGIN` variable is the valid host where requests are coming from to bypass CORS

Install all dependencie with

`npm install`

You can run the Express.js server by executing the following command in the terminal:

`npm start`

You should see the message "Server started on http://localhost:3000" in the console, indicating that the server is running and listening for incoming requests on port 3000.

You can test the CRU_ API by sending HTTP requests to the appropriate endpoints using a tool like curl or Postman.

For example, to create a new property, you can use the following command:

`curl -X POST -H "Content-Type: application/json" -d '{"address":"123 Elm St", "name":"Elmwood Apartments"}' http://localhost:3000/properties`

Or you can use postman to set the method to post, the header to "Content-Type: application/json" and the body with the same json object and the url http://localhost:3000/properties

To read all properties, you can use the following command:

`curl http://localhost:3000/properties`

You can also use the same commands to test the API for the other entities and the other CRU_ operations accordingly.

Please make sure that you have node.js installed on your machine and you are in the correct directory where the index.js file is located.

## Chai + Mocha tests
---
Run `npm test`, it will setup a test database and run unit tests for all the endpoints.


## Test commands
---

#### CI with Github Actions

This project is setup with a Github actions file (under the .github folder) that will automatically run the unit tests with every commit.

### CURL commands list:

Here is a list of curl commands that you can use to test the CRUD API for properties, apartments, and tenants:

#### Property Manager:

Create a new property manager:

`curl -d '{"name":"John Doe"}' -H "Content-Type: application/json" -X POST http://localhost:3000/propertyManagers`

Read all property managers:

`curl http://localhost:3000/propertyManagers`

Update a specific property manager by id:

`curl -d '{"name":"Jane Doe"}' -H "Content-Type: application/json" -X PUT http://localhost:3000/propertyManagers/1`

#### Properties:

Create a new property:

`curl -X POST -H "Content-Type: application/json" -d '{"address":"123 Elm St", "name":"Elmwood Apartments", "propertyManagerId": 1}' http://localhost:3000/properties`

Read all properties:

`curl http://localhost:3000/properties`

Read a specific property by id:

`curl http://localhost:3000/properties/1`

Update a specific property by id:

`curl -X PUT -H "Content-Type: application/json" -d '{"address":"456 Elm St", "name":"Elmwood Apartments"}' http://localhost:3000/properties/1`

#### Apartments:

Create a new apartment:

`curl -X POST -H "Content-Type: application/json" -d '{"propertyId":1, "unitNumber":"101"}' http://localhost:3000/apartments`

Read all apartments:

`curl http://localhost:3000/apartments`

Read a specific apartment by id:

`curl http://localhost:3000/apartments/1`

Update a specific apartment by id:

`curl -X PUT -H "Content-Type: application/json" -d '{"propertyId":1, "unitNumber":"102"}' http://localhost:3000/apartments/1`

#### Tenants:

Create a new tenant:

`curl -X POST -H "Content-Type: application/json" -d '{"firstName":"John", "lastName":"Doe", "dob":"01/01/1980", "ssn":"123-45-6789", "isPrimary":true "apartmentId":1}' http://localhost:3000/tenants`

Read all tenants:

`curl http://localhost:3000/tenants`

Read a specific tenant by id:

`curl http://localhost:3000/tenants/1`

Update a specific tenant by id:

`curl -X PUT -H "Content-Type: application/json" -d '{"firstName":"Jane", "lastName":"Doe", "dob":"01/01/1980", "ssn":"123-45-6789", "isPrimary":true, "apartmentId":1}' http://localhost:3000/tenants/1`

#### Payments:

Create payments:

`curl -X POST
  http://localhost:3000/tenants/1/payments
  -H 'Content-Type: application/json'
  -d '{
	"amount": 100,
	"date": "2022-01-19"
}'
`

Payments history for tenant:

`curl -X GET http://localhost:3000/tenants/1/payments/history`

## Future enhancements (Revenue for historical period):
---

We could extend the service to store rent payments history and make queries that allow us to pull revenue history from a given property or apartment over a given time window:

1. Create a new table in the database to store the rent payments history. This table should have columns for the property/apartment ID, the tenant ID, the payment amount, the payment date, and any other relevant information (e.g. lease start and end date).

2. Modify the existing code that handles creating payments to also insert a new row in the rent payments history table. This will ensure that all future payments are tracked in the new table.

3. Create a new endpoint in the API that allows for querying the rent payments history table by property/apartment ID and time window. The endpoint should accept query parameters for the property/apartment ID, the start and end dates of the time window, and any other relevant parameters.

4. In the endpoint implementation, use SQL queries to retrieve the relevant data from the rent payments history table. Use the provided property/apartment ID, start and end dates, and any other relevant parameters to filter the data and aggregate the revenue by property/apartment over the given time window.

5. Return the result of the query as a JSON object containing the revenue generated by the property/apartment over the given time window.

6. Add the tests for the new endpoint, testing the different scenarios and validating the response.