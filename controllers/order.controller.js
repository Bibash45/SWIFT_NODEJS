import {
  createOrders,
  getAllOrders,
  getOrderByField,
  updateOrders,
  deleteOrders,
} from "../query/order.query.js";

export const createOrderController = async (req, res) => {
  try {
    const result = await createOrders(req.body);
    res.status(201).json({
      success: true,
      message: "Order created",
      orderId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAllOrderController = async (req, res) => {
  try {
    const { page = 1, limit = 1 } = req.query;
    const orders = await getAllOrders(page, limit);
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getOrderByFieldController = async (req, res) => {
  const { field, value } = req.query;
  try {
    if (!field || !value) {
      return res
        .status(400)
        .json({ success: false, message: "Missing field/value" });
    }

    const order = await getOrderByField(field, value);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateOrderByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await updateOrders(id, req.body);
    if (result.error) {
      return res.status(404).json({ success: false, message: result.error });
    }
    res
      .status(200)
      .json({ success: true, message: "Order updated", data: result.data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteOrderByFieldController = async (req, res) => {
  const { field, value } = req.query;
  try {
    const result = await deleteOrders(field, value);
    if (result.error) {
      return res.status(404).json({ success: false, message: result.error });
    }
    res.status(200).json({ success: true, message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
