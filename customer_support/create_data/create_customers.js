import { fakerPT_BR as faker } from '@faker-js/faker';

const firstName = faker.person.firstName();
const lastName = faker.person.lastName();

console.log(firstName);
console.log(lastName);
console.log(faker.date.birthdate());
console.log(faker.location.state());
console.log(faker.internet.email({ firstName:  firstName, lastName: lastName }));