import { Request, Response } from "express";
import { ICustomer } from "../interfaces";

import { validate, schemaCreateUser } from "../validations/validations";
import { Api, Message } from "../utils/constants";
import {
  create,
  get,
  getAll,
  getCity,
  getExistingCustomer,
} from "../db/operations";

/**
 * @description This controller is used get data of a particular Customer.
 */

export const findCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    /* id of a customer */
    const userId = req.params.id as string;

    /* get customer data */

    const getCustomerDetails = await get(userId);

    if (!getCustomerDetails.success) {
      return Api.badRequest(res, null, getCustomerDetails.message);
    }

    return Api.ok(res, getCustomerDetails.data, getCustomerDetails.message);
  } catch (error: any) {
    return Api.serverError(req, res, error, error.message);
  }
};

/**
 * @description This controller is used to find customer count per city.
 */

export const findCustomerPerCity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    /* getting city data */

    const getCityDetails = await getCity();

    if (!getCityDetails.success) {
      return Api.badRequest(res, null, getCityDetails.message);
    }

    return Api.ok(res, getCityDetails.data, getCityDetails.message);
  } catch (error: any) {
    return Api.serverError(req, res, error, error.message);
  }
};

/**
 * @description This controller is used to get the customer details according to their first name, last name, city *
 */

export const findAll = async (req: Request, res: Response): Promise<void> => {
  try {
    /* filter values from request query */

    const firstName = req.query.firstName as string;
    const lastName = req.query.lastName as string;
    const city = req.query.city as string;

    const limit = req.query.limit as string;
    const page = req.query.page as string;

    /** fetching all orders */

    const orders = await getAll(limit, page, firstName, lastName, city);

    if (!orders.success) {
      return Api.badRequest(res, null, orders.message);
    }

    return Api.ok(res, orders.data, orders.message);
  } catch (error: any) {
    return Api.serverError(req, res, error, error.message);
  }
};

/**
 * @description This controller is used for adding a new Customer.
 */

export const addCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    /* validating user request  */

    const validateObj = {
      ...req.body,
    };

    const validation = await validate(validateObj, schemaCreateUser);

    if (!validation.success) {
      return Api.invalid(res, validation.error, validation.message as string);
    }

    /* check if customer already exists */

    const customerData = await getExistingCustomer(validateObj as ICustomer);

    if (customerData.success) {
      return Api.badRequest(res, null, Message.AlreadyExists);
    }

    /** saving data in db */

    const customer = await create(validateObj as ICustomer);

    if (!customer.success) {
      return Api.badRequest(res, null, customer.message);
    }

    return Api.created(res, customer.data, customer.message);
  } catch (error: any) {
    return Api.serverError(req, res, error, error.message);
  }
};
