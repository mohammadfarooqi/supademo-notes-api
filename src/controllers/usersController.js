import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UsersService from '../services/usersService.js';
import {
  createUsersSchema,
  loginUsersSchema,
} from '../validations/usersValidation.js';
import createApiResponse from '../utils/apiResponse.js';
import cleanValidationError from '../utils/cleanValidationError.js';
import cleanUserObj from '../utils/cleanUserObj.js';
import _ from 'lodash';

const JWT_SECRET = process.env.JWT_SECRET;

// User Registration
async function createUser(req, res) {
  try {
    const { error, value: user } = createUsersSchema.validate(req.body);
    if (error) {
      const response = createApiResponse(
        'error',
        null,
        'Validation failed',
        cleanValidationError(error)
      );
      return res.status(400).json(response);
    }

    const newUser = await UsersService.createUser(user);

    const response = createApiResponse('success', newUser, null, null);
    res.status(201).json(response);
  } catch (error) {
    console.error('error', error);

    if (error.message == 'USER_EXISTS') {
      const response = createApiResponse(
        'error',
        null,
        null,
        'User with this username already exists'
      );
      return res.status(409).json(response);
    }

    const response = createApiResponse(
      'error',
      null,
      'Internal server error',
      error.message
    );
    res.status(500).json(response);
  }
}

// User Login
async function loginUser(req, res) {
  try {
    const { error, value: user } = loginUsersSchema.validate(req.body);
    if (error) {
      const response = createApiResponse(
        'error',
        null,
        'Validation failed',
        cleanValidationError(error)
      );
      return res.status(400).json(response);
    }

    user.username = user.username.toLowerCase();

    const userObj = await UsersService.getUserByUsername(user.username);
    if (!userObj) {
      const response = createApiResponse(
        'error',
        null,
        'Authentication failed',
        null
      );
      return res.status(401).json(response);
    }

    const passwordMatch = await bcrypt.compare(user.password, userObj.password);

    if (!passwordMatch) {
      const response = createApiResponse(
        'error',
        null,
        'Authentication failed',
        null
      );
      return res.status(401).json(response);
    }

    const token = jwt.sign(cleanUserObj(userObj), JWT_SECRET, {
      expiresIn: '1h',
    });

    const response = createApiResponse('success', { token }, null, null);
    res.status(200).json(response);
  } catch (error) {
    console.error('error', error);

    const response = createApiResponse(
      'error',
      null,
      'Internal server error',
      error.message
    );
    res.status(500).json(response);
  }
}
export { createUser, loginUser };
