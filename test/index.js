const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");
const expect = chai.expect;
const should = chai.should();

process.env.ORIGIN = '127.0.0.1'

chai.use(chaiHttp);

describe("Property Managers", () => {
    it("should create a property manager", (done) => {
        chai
            .request(app)
            .post("/propertyManagers")
            .send({ name: "John Doe" })
            .end((err, res) => {
                if (err) {
                    console.error(err)
                    done()
                } else {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("id");
                    expect(res.body).to.have.property("name", "John Doe");
                    done();
                }
            });
    });

    it("should throw an error if property manager parameters are not sent", (done) => {
        chai
            .request(app)
            .post("/propertyManagers")
            .send({})
            .end((err, res) => {
                if (err) {
                    console.error(err)
                    done()
                } else {
                    expect(res).to.have.status(500);
                    done();
                }
            });
    });

    it("should update a property manager", (done) => {
        chai
            .request(app)
            .post("/propertyManagers")
            .send({ name: "John Doe" })
            .end((err, resp) => {
                if (err) {
                    console.error(err)
                    done()
                } else {
                    expect(resp).to.have.status(200);
                    expect(resp.body).to.have.property("id");
                    expect(resp.body).to.have.property("name", "John Doe");
                    chai
                        .request(app)
                        .put(`/propertyManagers/${resp.body.id}`)
                        .send({ name: "Jane Doe" })
                        .end((err, res) => {
                            if (err) {
                                console.error(err)
                                done()
                            } else {
                                expect(res).to.have.status(200);
                                expect(res.body).to.have.property("id", res.body.id);
                                expect(res.body).to.have.property("name", "Jane Doe");
                                done();
                            }
                        });
                }
            });
    });

    it("should return error if try to update a non-existing property manager", async () => {
        const res = await chai
            .request(app)
            .put(`/propertyManagers/123`)
            .send({ name: "Jane Doe" });

        expect(res).to.have.status(404);
        expect(res.text).to.equal("Property manager not found.");
    });
});

describe("Properties", () => {
    it("should list all properties on /properties GET", (done) => {
        chai
            .request(app)
            .get("/properties")
            .end((err, res) => {
                if (err) {
                    console.error(err)
                    done()
                } else {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("array");
                    done();
                }
            });
    });

    it("should add a new property on /properties POST", (done) => {
        chai
            .request(app)
            .post("/propertyManagers")
            .send({ name: "John Doe" })
            .end((err, res) => {
                if (err) {
                    console.error(err)
                    done()
                } else {
                    let propertyManagerId = res.body.id;

                    chai
                        .request(app)
                        .post("/properties")
                        .send({ name: "Test property", address: "123 Test St", propertyManagerId: propertyManagerId })
                        .end((err, res) => {
                            if (err) {
                                console.error(err)
                                done()
                            } else {
                                expect(res).to.have.status(201);
                                expect(res.body).to.be.an("object");
                                expect(res.body.name).to.equal("Test property");
                                expect(res.body.address).to.equal("123 Test St");
                                done();
                            }
                        });
                }
            });
    });

    it("should throw an error if property parameters are not sent", (done) => {
        chai
            .request(app)
            .post("/properties")
            .send({})
            .end((err, res) => {
                if (err) {
                    console.error(err)
                    done()
                } else {
                    expect(res).to.have.status(500);
                    done();
                }
            });
    });

    it("should update a property on /properties/:id PUT", (done) => {
        chai
            .request(app)
            .post("/propertyManagers")
            .send({ name: "John Doe" })
            .end((err, res) => {
                let propertyManagerId = res.body.id;
                chai
                    .request(app)
                    .post("/properties")
                    .send({ name: "Test property", address: "123 Test St", propertyManagerId: propertyManagerId })
                    .end((err, res) => {
                        if (err) {
                            console.error(err)
                            done()
                        } else {
                            let index = res.body.id;
                            chai
                                .request(app)
                                .get("/properties")
                                .end((err, res) => {
                                    expect(res).to.have.status(200);
                                    chai
                                        .request(app)
                                        .put(`/properties/${index}`)
                                        .send({ name: "Updated property", address: "456 Updated St" })
                                        .end((err, res) => {
                                            if (err) {
                                                console.error(err)
                                                done()
                                            } else {
                                                expect(res).to.have.status(200);
                                                expect(res.body).to.be.an("object");
                                                expect(res.body.name).to.equal("Updated property");
                                                expect(res.body.address).to.equal("456 Updated St");
                                                done();
                                            }
                                        });
                                });
                        }
                    });
            });
    });
});

describe("Apartments", () => {
    it("should list all apartments on /apartments GET", (done) => {
        chai
            .request(app)
            .get("/apartments")
            .end((err, res) => {
                if (err) {
                    console.error(err)
                    done()
                } else {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("array");
                    done();
                }
            });
    });

    it("should add a new apartment on /apartments POST", (done) => {
        chai
            .request(app)
            .post("/apartments")
            .send({ unitNumber: "A101", propertyId: 1 })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an("object");
                expect(res.body.unitNumber).to.equal("A101");
                expect(res.body.propertyId).to.equal(1);
                done();
            });
    });

    it("should throw an error if apartment parameters are not sent", (done) => {
        chai
            .request(app)
            .post("/apartments")
            .send({})
            .end((err, res) => {
                if (err) {
                    console.error(err)
                    done()
                } else {
                    expect(res).to.have.status(500);
                    done();
                }
            });
    });

    it("should update an apartment on /apartments/:id PUT", (done) => {
        chai
            .request(app)
            .put("/apartments/1")
            .send({ unitNumber: "B202", propertyId: 2 })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body.unitNumber).to.equal("B202");
                expect(res.body.propertyId).to.equal(2);
                done();
            });
    });
});

describe('Payments', () => {
    describe('/POST payment', () => {
        it('it should POST a payment', (done) => {
            const payment = {
                amount: 100,
                date: "2022-01-19"
            }
            chai.request(app)
                .post('/tenants/1/payments')
                .send(payment)
                .end((err, res) => {
                    if (err) {
                        console.error(err)
                        done()
                    } else {
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        res.body.should.have.property('amount').eql(payment.amount);
                        res.body.should.have.property('date').eql(payment.date);
                        done();
                    }
                });
        });

        it('it should not POST a payment without date field', (done) => {
            const payment = {
                amount: 100
            }
            chai.request(app)
                .post('/tenants/1/payments')
                .send(payment)
                .end((err, res) => {
                    if (err) {
                        console.error(err)
                        done()
                    } else {
                        res.should.have.status(422);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');
                        res.body.errors.should.be.a('array');
                        res.body.errors[0].should.have.property('param').eql('date');
                        done();
                    }
                });
        });
    });
    describe('/GET payments', () => {
        it('it should GET all the payments', (done) => {
            const payment = {
                amount: 100,
                date: "2022-01-19"
            }
            chai.request(app)
                .post('/tenants/1/payments')
                .send(payment)
                .end((err, res) => {
                    if (err) {
                        console.error(err)
                        done()
                    } else {
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        res.body.should.have.property('amount').eql(payment.amount);
                        res.body.should.have.property('date').eql(payment.date);

                        chai.request(app)
                            .get('/tenants/1/payments/history')
                            .end((err, res) => {
                                if (err) {
                                    console.error(err)
                                    done()
                                } else {
                                    res.should.have.status(200);
                                    res.body.should.be.a('array');
                                    done();
                                }
                            });
                    }
                });
        });
    });
});

describe('Tenants', () => {
    it('should list ALL tenants on /tenants GET', (done) => {
        chai.request(app)
            .get('/tenants')
            .end((err, res) => {
                if (err) {
                    console.error(err)
                    done()
                } else {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    done();
                }
            });
    });

    it('should list a SINGLE tenant on /tenant/<id> GET', (done) => {
        const tenant = {
            firstName: 'John',
            lastName: 'Doe',
            dob: '1970-01-01',
            ssn: '123-45-6789',
            isPrimary: true,
            apartmentId: '1'
        };

        chai.request(app)
            .post('/tenants')
            .send(tenant)
            .end((err, res) => {
                chai.request(app)
                    .get(`/tenants/${res.body.id}`)
                    .end((err, res) => {
                        if (err) {
                            console.error(err)
                            done()
                        } else {
                            res.should.have.status(200);
                            res.should.be.json;
                            res.body.should.be.a('object');
                            res.body.should.have.property('id');
                            res.body.should.have.property('firstName');
                            res.body.should.have.property('lastName');
                            res.body.should.have.property('dob');
                            res.body.should.have.property('ssn');
                            res.body.should.have.property('isPrimary');
                            res.body.should.have.property('apartmentId');
                            done();
                        }
                    });
            });
    });

    it('should add a SINGLE tenant on /tenant POST', (done) => {
        chai.request(app)
            .post('/tenants')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                dob: '1970-01-01',
                ssn: '123-45-6789',
                isPrimary: true,
                apartmentId: '1'
            })
            .end((err, res) => {
                if (err) {
                    console.error(err)
                    done()
                } else {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('firstName');
                    res.body.should.have.property('lastName');
                    res.body.should.have.property('dob');
                    res.body.should.have.property('ssn');
                    res.body.should.have.property('isPrimary');
                    res.body.should.have.property('apartmentId');
                    done();
                }
            });
    });

    it("should throw an error if tenant parameters are not sent", (done) => {
        chai
            .request(app)
            .post("/tenants")
            .send({})
            .end((err, res) => {
                if (err) {
                    console.error(err)
                    done()
                } else {
                    expect(res).to.have.status(500);
                    done();
                }
            });
    });

    it('should update a SINGLE tenant on /tenant/<id> PUT', (done) => {
        const tenant = {
            firstName: 'John',
            lastName: 'Doe',
            dob: '1970-01-01',
            ssn: '123-45-6789',
            isPrimary: true,
            apartmentId: '1'
        };

        chai.request(app)
            .post('/tenants')
            .send(tenant)
            .end((err, res) => {
                if (err) {
                    console.error(err)
                    done()
                } else {
                    chai.request(app)
                        .put(`/tenants/${res.body.id}`)
                        .send({ firstName: 'Jane' })
                        .end((err, res) => {
                            if (err) {
                                console.error(err)
                                done()
                            } else {
                                res.should.have.status(200);
                                res.should.be.json;
                                res.body.should.be.a('object');
                                res.body.should.have.property('firstName').eql('Jane');
                                done();
                            }
                        });
                }
            });
    });
});