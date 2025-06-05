import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { validate } from 'uuid';

@ValidatorConstraint({ async: false })
export class IsUUIDConstraint implements ValidatorConstraintInterface {
  validate(uuid: any, args: ValidationArguments) {
    return validate(uuid);
  }
}

export function IsUUID(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUUIDConstraint,
    });
  };
}
