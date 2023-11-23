import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const JoiPassword = Joi.extend(joiPasswordExtendCore);

const user = {
  username: Joi.string().min(5).max(25).required(),
  password: JoiPassword.string()
    .min(8)
    .max(16)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required(),
};

const createUsersSchema = Joi.object({ ...user });

const loginUsersSchema = Joi.object({ ...user });

export { createUsersSchema, loginUsersSchema };
