import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator';

@ValidatorConstraint({ name: 'strongPassword', async: false })
export class StrongPasswordValidator implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    // Password should be at least 8 characters long
    if (password.length < 8) return false;

    // Password should contain at least one uppercase letter
    if (!/[A-Z]/.test(password)) return false;

    // Password should contain at least one lowercase letter
    if (!/[a-z]/.test(password)) return false;

    // Password should contain at least one digit
    if (!/\d/.test(password)) return false;

    // Password should contain at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.';
  }
}
