import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const seed = function (knex) {
  return knex('users')
    .del()
    .then(async function () {
      const password = await bcrypt.hash('SuperDuper1@!', 10);
      const users = Array(10)
        .fill(null)
        .map(() => ({
          username: faker.internet.userName().toLowerCase(),
          password,
        }));

      return knex('users').insert(users);
    });
};
