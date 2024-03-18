import { db } from "../server";
import { Message } from "../utils/constants";
import { ICustomer } from "../interfaces/Customer";
import { ObjectId } from "mongodb";

export async function create(customerData: ICustomer) {
  try {
    const userId = new ObjectId();
    const customerCreation = await db
      .collection("customers")
      .insertOne({ ...customerData, id: userId, _id: userId });

    if (!customerCreation.acknowledged) {
      return { success: false, message: Message.InsertionFailed };
    }

    return { success: true, message: Message.Created, data: { id: userId } };
  } catch (error) {
    return { success: false, message: (error as any).message };
  }
}

export async function get(userId: string) {
  try {
    const qb = [{ _id: new ObjectId(userId) }, { projection: { _id: 0 } }];
    const customer = await db.collection("customers").findOne(...qb);
    if (!customer) {
      return { success: false, message: Message.NotFound };
    }
    return { success: true, data: customer, message: Message.Found };
  } catch (error) {
    return { success: false, message: Message.NotFound, error };
  }
}

export async function getExistingCustomer(customerData: ICustomer) {
  try {
    const qb = {
      $or: [{ email: customerData.email }, { phone: customerData.phone }],
    };
    const customer = await db.collection("customers").findOne(qb);
    if (!customer) {
      return { success: false, message: Message.NotFound };
    }
    return { success: true, data: customer, message: Message.Found };
  } catch (error) {
    return { success: false, message: Message.NotFound, error };
  }
}

export async function getCity() {
  try {
    const qb = [
      {
        $group: {
          _id: "$city",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          city: "$_id",
          customers: "$count",
          _id: 0,
        },
      },
      {
        $sort: {
          customers: -1,
        },
      },
    ];

    let data = await db.collection("customers").aggregate(qb);

    data = await data.toArray();

    if (!data.length) {
      return { success: false, message: Message.NotFound };
    }

    return { success: true, data, message: Message.Found };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getAll(
  _limit: string,
  _page: string,
  firstName: string,
  lastName: string,
  city: string
) {
  try {
    const limit = _limit ? parseInt(_limit as string) : 10;
    const page = _page ? parseInt(_page as string) : 1;

    const skipItem = (page - 1) * limit;

    const qb = [
      ...(firstName || lastName || city
        ? [
            {
              $match: {
                $and: [
                  ...(firstName ? [{ first_name: firstName }] : [{}]),
                  ...(lastName ? [{ last_name: lastName }] : [{}]),
                  ...(city ? [{ city: city }] : [{}]),
                ],
              },
            },
          ]
        : [{ $match: {} }]),
      { $skip: skipItem },
      { $limit: limit },

      {
        $project: {
          _id: 0,
        },
      },
    ];

    let orders = await db.collection("customers").aggregate(qb);

    orders = await orders.toArray();

    if (!orders.length) {
      return { success: false, message: Message.NotFound };
    }

    return { success: true, data: orders, message: Message.Found };
  } catch (error: any) {
    return { success: false, message: Message.NotFound, error };
  }
}
