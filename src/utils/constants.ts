import { Request, Response } from "express";

("use strict");

const _hasOwnProperty = Object.prototype.hasOwnProperty;

const Status = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNSUPPORTED_ACTION: 405,
  VALIDATION_FAILED: 422,
  SERVER_ERROR: 500,
  CREATED: 201,
  PROXY_ERROR: 502,
  MAINTENANCE_MODE: 503,
};
export const Message = {
  ValidationError: "Validation error",
  Created: "Created Successfully",
  NotFound: "Not Found",
  Found: "Found Successfully",
  InsertionFailed: "Insert Operation Failed",
  AlreadyExists: "Customer Already Exists",
};

function statusMessage(status: number) {
  switch (status) {
    case Status.BAD_REQUEST:
      return "Bad Request";
    case Status.UNAUTHORIZED:
      return "Unauthorized";
    case Status.FORBIDDEN:
      return "Forbidden";
    case Status.NOT_FOUND:
      return "Not Found";
    case Status.UNSUPPORTED_ACTION:
      return "Unsupported Action";
    case Status.VALIDATION_FAILED:
      return "Validation Failed";
    case Status.SERVER_ERROR:
      return "Internal Server Error";
    case Status.CREATED:
      return "Created";
    case Status.MAINTENANCE_MODE:
      return "maintenance mode";
  }
}

function jsonResponse(res: Response, body: any, message: string, options: any) {
  options = options || {};
  options.status = options.status;
  let success: boolean;
  if (options.status === Status.OK || options.status === Status.CREATED) {
    success = true;
  } else {
    success = false;
  }
  return res
    .status(options.status)
    .json({ success: success, data: body || null, message: message || "" });
}

const Api = {
  ok(res: Response, data: any, message: string) {
    jsonResponse(res, data, message, {
      status: Status.OK,
    });
  },

  badRequest(res: Response, errors: any, message: string) {
    if (errors === null) {
      errors = null;
    } else {
      errors = Array.isArray(errors) ? errors : [errors];
    }

    let body = null as any;

    if (errors) {
      body = {
        message: statusMessage(Status.BAD_REQUEST),
        errors,
      };
    }

    jsonResponse(res, body, message, {
      status: Status.BAD_REQUEST,
    });
  },
  notFound(request: Request, res: Response, message: string) {
    const body = {
      message: statusMessage(Status.NOT_FOUND),
    };

    jsonResponse(res, body, message, {
      status: Status.NOT_FOUND,
    });
  },
  invalid(res: Response, errors: any, message: string) {
    errors = Array.isArray(errors) ? errors : [errors];

    const body = {
      message: statusMessage(Status.VALIDATION_FAILED),
      errors,
    };

    jsonResponse(res, body, message, {
      status: Status.VALIDATION_FAILED,
    });
  },
  serverError(request: Request, res: Response, error: any, message: string) {
    if (error instanceof Error) {
      error = {
        message: error.message,
      };
    }
    const body = {
      message: statusMessage(Status.SERVER_ERROR),
      error,
    };

    jsonResponse(res, body, message, {
      status: Status.SERVER_ERROR,
    });
  },
  created(res: Response, data: any, message: string) {
    jsonResponse(res, data, message, {
      status: Status.CREATED,
    });
  },
};

export { Api };
