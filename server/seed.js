const seedUsers = require('./seed/user');
const seedBooks = require('./seed/book');
require("dotenv").config();

const args = process.argv.slice(2);
const onlyUser = args.includes('--only-users');
const onlyBooks = args.includes('--only-books');

if (onlyUser && onlyBooks) {
  console.error('Please choose only one option: --only-user or --only-books');
  process.exit(1);
}

if (onlyUser) {
  seedUsers().then(() => {
    process.exit(0);
  });
}
if (onlyBooks) {
  seedBooks().then(() => {
    process.exit(0);
  });
}

async function seedAll() {
  await seedBooks();
  await seedUsers();
}

seedAll().then(() => {
  process.exit(0);
});