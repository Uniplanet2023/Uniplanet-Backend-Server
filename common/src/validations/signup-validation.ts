// validators.ts
import { body, ValidationChain } from 'express-validator';
import { UserType } from '../entities/user-type';

export const emailValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Email must be valid')
    .custom(value => {
      if (/.+@[A-Z]/g.test(value)) {
        throw new Error('Email is not normalized');
      }
      return true;
    })
    .withMessage('Email is not normalized')
    .normalizeEmail({
      gmail_remove_dots: false,
    }),
];

export const nameValidation: ValidationChain = body('name')
  .isString()
  .withMessage('Name should be a string');

export const profileImageValidation: ValidationChain = body('profileImage')
  .isURL()
  .withMessage('Profile Image should be a URL');

export const schoolValidation: ValidationChain = body('school')
  .isString()
  .withMessage('School should be a string');

export const verifiedValidation: ValidationChain = body('verified')
  .isBoolean()
  .withMessage('Verified should be a boolean value');

export const passwordValidation: ValidationChain[] = [
  body('password')
    .trim()
    .isLength({ min: 8, max: 32 })
    .withMessage('Password must be between 8 and 32 characters'),
  body('password')
    .matches(/^(.*[a-z].*)$/)
    .withMessage('Password must contain at least one lowercase letter'),
  body('password')
    .matches(/^(.*[A-Z].*)$/)
    .withMessage('Password must contain at least one uppercase letter'),
  body('password')
    .matches(/^(.*\d.*)$/)
    .withMessage('Password must contain at least one digit'),
  body('password')
    .isStrongPassword()
    .withMessage('Password should be strong enough'),
  body('password').trim(),
];

export const phoneNumberValidation: ValidationChain = body('phoneNumber')
  .isMobilePhone('en-US') // Specify locale for validation
  .withMessage('Phone number must be a valid US mobile number');

export const userTypeValidation: ValidationChain = body('userType')
  .isString()
  .custom(value => {
    if (!Object.values(UserType).includes(value)) {
      throw new Error('Invalid user type');
    }
    return true;
  })
  .withMessage('User type must be one of the following: student, local, admin, advertiser');
  

