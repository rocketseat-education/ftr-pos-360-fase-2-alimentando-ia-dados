import { fakerPT_BR as faker } from '@faker-js/faker';

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

const customer = createCustomer();

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

console.log(createPurchases(customer));

