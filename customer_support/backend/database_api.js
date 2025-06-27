import { Pool } from 'pg';

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',      // coloque o usuário do seu banco
    password: 'root',    // coloque a senha do seu banco
    database: 'customer-chat'
});

function getCustomerInfo(email){
    const customer = getCustomer(email);
    const purchases = getCustomerPurchases(customer);

    return {
        customer: customer,
        purchases: purchases
    }
}

async function getCustomer(email){
    const query = `SELECT * FROM customers WHERE email = '${email}'`
    return (await pool.query(query)).rows[0];
}

async function getCustomerPurchases(customer){
    const query = `SELECT * FROM purchases WHERE customer_id = '${customer.id}'`;
    return (await pool.query(query)).rows[0];
}

export { getCustomerInfo }