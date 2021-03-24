const Order = require('../models/Order');
const { sendSms } = require('../utils/twilio');

module.exports = class OrderService {
  static async create({ quantity }) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `New Order received for ${quantity}`
    );

    const order = await Order.insert({ quantity });

    return order;
  }
  static async getOrders() {

    const orders = await Order.getAll();

    return orders;
  }
  static async getSingleOrder(id) {

    const order = await Order.getOrderById(id);

    return order;
  }
};
