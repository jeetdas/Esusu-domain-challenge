const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors')
const moment = require('moment');
const morgan = require('morgan')
const { check, validationResult } = require('express-validator');

// Use body-parser to parse JSON bodies
app.use(bodyParser.json());

// Use morgan to log requests
app.use(morgan('common'))

// Use cors to block requests not from valid origin
const origin = process.env.ORIGIN || '127.0.0.1'
console.log('Using CORS with origin %s', origin)
app.use(cors({ origin }))

// Connect to SQLite database
const db = require('./db');

//create property manager
app.post("/propertyManagers", (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(500).send("Error creating property manager. Please send a name.");
    } else {
        db.run("INSERT INTO propertyManagers (name) VALUES (?)", name,
            function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error creating property manager.");
                } else {
                    res.json({ id: this.lastID, name });
                }
            });
    }
});

// Read all property managers
app.get("/propertyManagers", (req, res) => {
    db.all("SELECT * FROM propertyManagers", (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading property managers.");
        } else {
            res.json(rows);
        }
    });
});

//update property manager
app.put("/propertyManagers/:id", (req, res) => {
    const propertyManagerId = parseInt(req.params.id);
    const { name } = req.body;
    db.get("SELECT * FROM propertyManagers WHERE ID = ?", [propertyManagerId], (err, propertyManager) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error getting property manager.");
        } else if (!propertyManager) {
            res.status(404).send("Property manager not found.");
        } else if (!name) {
            res.status(500).send("Property manager could not be updated. Please send a valid name.");
        } else {
            db.run(
                `UPDATE propertyManagers SET name = ? WHERE id = ?`,
                [name, propertyManagerId],
                (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send("Error updating property.");
                    } else if (this.changes === 0) {
                        res.status(404).send("Property not found.");
                    } else {
                        propertyManager.id = propertyManagerId;
                        propertyManager.name = name;
                        res.json(propertyManager);
                    }
                }
            );
        }
    });
});

// Create a new property
app.post("/properties", (req, res) => {
    let newProperty = req.body;
    if (!newProperty.address || !newProperty.name || !newProperty.propertyManagerId) {
        res.status(500).send("Property could not be created. Please send all required parameters.");
    } else {
        db.run(
            `INSERT INTO properties (address, name, propertyManagerId) VALUES (?, ?, ?)`,
            [newProperty.address, newProperty.name, newProperty.propertyManagerId],
            function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error creating property.");
                } else {
                    newProperty.id = this.lastID;
                    res.status(201).json(newProperty);
                }
            }
        );
    }
});

// Read all properties
app.get("/properties", (req, res) => {
    db.all("SELECT * FROM properties", (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading properties.");
        } else {
            res.json(rows);
        }
    });
});

// Read a specific property by id
app.get("/properties/:id", (req, res) => {
    let propertyId = parseInt(req.params.id);
    db.get("SELECT * FROM properties WHERE id = ?", [propertyId], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading property.");
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).send("Property not found.");
        }
    });
});

// Update a specific property by id
app.put("/properties/:id", (req, res) => {
    let propertyId = parseInt(req.params.id);
    let updatedProperty = req.body;
    db.get("SELECT * FROM properties WHERE id = ?", [propertyId], (err, property) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error getting property.");
        } else if (!property) {
            res.status(404).send("Property not found.");
        } else {
            // Only update the properties that were sent in the request body
            if (updatedProperty.address) property.address = updatedProperty.address;
            if (updatedProperty.name) property.name = updatedProperty.name;
            if (updatedProperty.propertyManagerId) property.propertyManagerId = updatedProperty.propertyManagerId;

            db.run(
                "UPDATE properties SET address = ?, name = ?, propertyManagerId = ? WHERE id = ?",
                [property.address, property.name, property.propertyManagerId, propertyId],
                function (err) {
                    if (err) {
                        console.error(err);
                        res.status(500).send("Error updating property.");
                    } else if (this.changes === 0) {
                        res.status(404).send("Property not found.");
                    } else {
                        property.id = propertyId;
                        res.json(property);
                    }
                }
            );
        }
    });
});

// Create a new apartment
app.post("/apartments", (req, res) => {
    let newApartment = req.body;
    if (!newApartment.propertyId || !newApartment.unitNumber) {
        res.status(500).send("Apartment could not be created. Please send all required parameters.");
    } else {
        db.run(
            `INSERT INTO apartments (propertyId, unitNumber) VALUES (?, ?)`,
            [newApartment.propertyId, newApartment.unitNumber],
            function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error creating apartment.");
                } else {
                    newApartment.id = this.lastID;
                    res.status(201).json(newApartment);
                }
            }
        );
    }
});


// Read all apartments
app.get("/apartments", (req, res) => {
    db.all("SELECT * FROM apartments", (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading apartments.");
        } else {
            res.json(rows);
        }
    });
});

// Read a specific apartment by id
app.get("/apartments/:id", (req, res) => {
    let apartmentId = parseInt(req.params.id);
    db.get("SELECT * FROM apartments WHERE id = ?", [apartmentId], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading apartment.");
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).send("Apartment not found.");
        }
    });
});

// Update a specific apartment by id
app.put("/apartments/:id", (req, res) => {
    let apartmentId = parseInt(req.params.id);
    let updatedApartment = req.body;
    db.get("SELECT * FROM apartments WHERE id = ?", [apartmentId], (err, apartment) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error getting apartment.");
        } else if (!apartment) {
            res.status(404).send("Apartment not found.");
        } else {
            // Only update the properties that were sent in the request body
            if (updatedApartment.propertyId) apartment.propertyId = updatedApartment.propertyId;
            if (updatedApartment.unitNumber) apartment.unitNumber = updatedApartment.unitNumber;

            db.run(
                "UPDATE apartments SET propertyId = ?, unitNumber = ? WHERE id = ?",
                [apartment.propertyId, apartment.unitNumber, apartmentId],
                function (err) {
                    if (err) {
                        console.error(err);
                        res.status(500).send("Error updating apartment.");
                    } else if (this.changes === 0) {
                        res.status(404).send("Apartment not found.");
                    } else {
                        apartment.id = apartmentId;
                        res.json(apartment);
                    }
                }
            );
        }
    });
});


// Create a new tenant
app.post("/tenants", (req, res) => {
    let newTenant = req.body;
    if (!newTenant.firstName || !newTenant.lastName || !newTenant.dob || !newTenant.ssn || !newTenant.isPrimary || !newTenant.apartmentId) {
        res.status(500).send("Tenant could not be created. Please send all required parameters.");
    } else {
        db.run(
            `INSERT INTO tenants (firstName, lastName, dob, ssn, isPrimary, apartmentId) VALUES (?, ?, ?, ?, ?, ?)`,
            [newTenant.firstName, newTenant.lastName, newTenant.dob, newTenant.ssn, newTenant.isPrimary ? 1 : 0, newTenant.apartmentId],
            function (err) {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error creating tenant.");
                } else {
                    newTenant.id = this.lastID;
                    res.status(201).json(newTenant);
                }
            }
        );
    }
});

// Read all tenants
app.get("/tenants", (req, res) => {
    db.all("SELECT * FROM tenants", (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading tenants.");
        } else {
            res.json(rows);
        }
    });
});

// Read a specific tenant by id
app.get("/tenants/:id", (req, res) => {
    let tenantId = parseInt(req.params.id);
    db.get("SELECT * FROM tenants WHERE id = ?", [tenantId], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading tenant.");
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).send("Tenant not found.");
        }
    });
});

// Update a specific tenant by id
app.put("/tenants/:id", (req, res) => {
    let tenantId = parseInt(req.params.id);
    let updatedTenant = req.body;
    db.get("SELECT * FROM tenants WHERE id = ?", [tenantId], (err, tenant) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error getting tenant.");
        } else if (!tenant) {
            res.status(404).send("Tenant not found.");
        } else {
            // Only update the properties that were sent in the request body
            if (updatedTenant.firstName) tenant.firstName = updatedTenant.firstName;
            if (updatedTenant.lastName) tenant.lastName = updatedTenant.lastName;
            if (updatedTenant.dob) tenant.dob = updatedTenant.dob;
            if (updatedTenant.ssn) tenant.ssn = updatedTenant.ssn;
            if (updatedTenant.isPrimary) tenant.isPrimary = updatedTenant.isPrimary;
            if (updatedTenant.apartmentId) tenant.apartmentId = updatedTenant.apartmentId;

            db.run(
                "UPDATE tenants SET firstName = ?, lastName = ?, dob = ?, ssn = ?, isPrimary = ?, apartmentId = ? WHERE id = ?",
                [
                    tenant.firstName,
                    tenant.lastName,
                    tenant.dob,
                    tenant.ssn,
                    tenant.isPrimary,
                    tenant.apartmentId,
                    tenantId
                ],
                function (err) {
                    if (err) {
                        console.error(err);
                        res.status(500).send("Error updating tenant.");
                    } else if (this.changes === 0) {
                        res.status(404).send("Tenant not found.");
                    } else {
                        tenant.id = tenantId;
                        res.json(tenant);
                    }
                }
            );
        }
    });
});

// Create a payment for a given tenant
app.post('/tenants/:tenantId/payments', [
    check('amount').isNumeric().withMessage('Amount must be a number'),
    check('date').isISO8601().withMessage('Invalid date format').custom((value) => {
        return moment(value).isBefore(moment());
    }).withMessage('Date must be in the past')
],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const tenantId = req.params.tenantId;
        const { amount, date } = req.body;

        // Insert payment into the database
        db.run(
            `INSERT INTO payments (tenantId, amount, date) VALUES (${tenantId}, ${amount}, '${date}')`,
            (err) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Error creating payment',
                        error: err
                    });
                }
                res.status(201).json({
                    message: 'Payment created successfully',
                    amount,
                    date
                });
            }
        );
    });

// Get payment history for given tenant
app.get('/tenants/:tenantId/payments/history', (req, res) => {
    const tenantId = req.params.tenantId;
    db.all(
        `SELECT 
            strftime('%Y-%m', date) as month,
            sum(amount) as amount, 
            max(date) as date 
          FROM payments 
          WHERE tenantId = ${tenantId} 
          GROUP BY strftime('%Y-%m', date)`,
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error fetching payment history',
                    error: err
                });
            }
            res.json(rows);
        }
    );
});


// Start the server
app.listen(3000, () => {
    console.log("Server started on port 3000");
});

module.exports = app;