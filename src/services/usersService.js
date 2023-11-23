import db from '../../config/database.js';
import bcrypt from 'bcrypt';
import cleanUserObj from '../utils/cleanUserObj.js';

class UsersService {
  async createUser(user) {
    return db.transaction(async (trx) => {
      try {
        let { username } = user;
        const { password } = user;

        username = username.toLowerCase();

        const existingUser = await trx('users').where({ username }).first();

        if (existingUser) {
          throw new Error('USER_EXISTS');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [newUser] = await trx('users')
          .insert({
            username,
            password: hashedPassword,
          })
          .returning('*');

        return cleanUserObj(newUser);
        // return newUser;
      } catch (error) {
        throw error;
      }
    });
  }

  async getUserByUsername(username) {
    try {
      username = username.toLowerCase();
      const user = await db('users').where({ username }).first();
      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default new UsersService();
