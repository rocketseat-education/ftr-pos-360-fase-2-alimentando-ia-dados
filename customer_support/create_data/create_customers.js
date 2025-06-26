import { fakerPT_BR as faker } from '@faker-js/faker';
import { Pool } from 'pg';

function createCustomer() {

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
        id: faker.string.uuid(),
        firstName: firstName,
        lastName: lastName,
        birthDate: faker.date.birthdate(),
        state: faker.location.state(),
        email: faker.internet.email({ firstName: firstName, lastName: lastName })
    }
}

function createPurchases(customer) {
    const purchaseProbability = [
        { value: 0, weight: 10 },
        { value: 1, weight: 50 },
        { value: 2, weight: 20 },
        { value: 3, weight: 10 },
        { value: 4, weight: 7 },
        { value: 5, weight: 3 }
    ];

    const nPurchases = faker.helpers.weightedArrayElement(purchaseProbability);

    const status = [
        "confirmada",
        "pagamento confirmado",
        "em separação",
        "em transito",
        "entregue",
        "atrasada",
        "cancelado pelo usuário",
        "cancelado pelo vendedor"
    ];

    const purchases = [];

    for (let i = 0; i < nPurchases; i++) {
        purchases.push(
            {
                customerId: customer.id,
                product: faker.commerce.productName(),
                price: faker.commerce.price(),
                date: faker.date.recent({ days: 10 }),
                status: faker.helpers.arrayElement(status)
            }
        );
    }

    return purchases;
}


let purchases = [];

const customers = [];

for (let i=0; i<100; i++) {
    customers.push(createCustomer());
}

for(let customer of customers){
    purchases = purchases.concat(createPurchases(customer));
}

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',      // coloque o usuário do seu banco
    password: 'root',    // coloque a senha do seu banco
    database: 'customer-chat'
});

await pool.query(`DROP TABLE IF EXISTS purchases;`);
await pool.query(`DROP TABLE IF EXISTS customers;`);
await pool.query(`DROP TYPE IF EXISTS purchase_status;`);

await pool.query(`
    CREATE TABLE customers (
    id UUID PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    state VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL
);
`);

await pool.query(`
    CREATE TYPE purchase_status AS ENUM (
    'confirmada',
    'pagamento confirmado',
    'em separação',
    'em transito',
    'entregue',
    'atrasada',
    'cancelado pelo usuário',
    'cancelado pelo vendedor'
);
`);

await pool.query(`
    CREATE TABLE purchases (
        id UUID PRIMARY KEY,
        customer_id UUID NOT NULL,
        product VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        date DATE NOT NULL,
        status purchase_status NOT NULL,
        CONSTRAINT fk_customer
            FOREIGN KEY (customer_id)
            REFERENCES customers(id)
            ON DELETE CASCADE
);
`);