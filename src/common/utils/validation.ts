import { ValidationError } from "@nestjs/common";

export function transformValidationErrors(errors: ValidationError[]) {
  const errorMessage = {};

  errors.forEach((error) => {
    const field = error.property;

    const errorMessages = Object.values(error.constraints || {});
    if (errorMessages.length > 0) {
      errorMessage[field] = errorMessages[0];
    }
  });

  return {
    message: errorMessage,
    error: "Bad Request",
  };
}
