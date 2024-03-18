import Joi from "joi";
import { Message } from "../utils/constants";
import { ICustomer, Gender } from "../interfaces/Customer";

export const validate = async (
  data: ICustomer,
  schema: Joi.ObjectSchema<any>
) => {
  try {
    const value = await schema.validateAsync(data);

    return { success: true, data: value };
  } catch (error) {
    const errors: string[] = [];

    (error as any).details.forEach((error: any) => {
      errors.push(error.message);
    });

    return {
      success: false,
      error: errors,
      message: Message.ValidationError,
    };
  }
};

/** Create User request schema */

export const schemaCreateUser = Joi.object({
  first_name: Joi.string().max(20).required(),
  last_name: Joi.string().max(20).required(),
  gender: Joi.string()
    .valid(Gender[Gender.Male], Gender[Gender.Female])
    .required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  city: Joi.string().max(30).required(),
  company: Joi.string().max(50).required(),
}).options({ abortEarly: false });
