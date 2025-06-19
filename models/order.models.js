import db from "../config/db.config.js";

// 🔹 Create orders (static logic is okay here)
export const createOrders = async (data) => {
  const { userId, totalPrice, orderItems } = data;

  const [orderResult] = await db.query(
    "INSERT INTO orders (userId, totalPrice) VALUES (?, ?)",
    [userId, totalPrice]
  );
  const orderId = orderResult.insertId;

  for (const item of orderItems) {
    const { productId, quantity } = item;
    await db.query(
      "INSERT INTO orderItems (orderId, productId, quantity) VALUES (?, ?, ?)",
      [orderId, productId, quantity]
    );
  }

  return orderResult;
};

// 🔹 Get all orders
export const getAllOrders = async () => {
  const [rows] = await db.query("SELECT * FROM orders");
  return rows;
};

// 🔹 Get order by any field
export const getOrderByField = async (field, value) => {
    console.log(field,value);
    
  const query = `SELECT * FROM orders WHERE ${field} = ?`;
  const [rows] = await db.query(query, [value]);
  return rows.length ? rows[0] : null;
};

// 🔹 Update order by ID (can be extended to field if needed)
export const updateOrders = async (orderId, data) => {
  try {
    const { userId, totalPrice, orderItems } = data;

    const existingOrder = await getOrderByField("id", orderId);
    if (!existingOrder) {
      return { error: "Order not found" };
    }

    const fields = [];
    const values = [];

    if (userId !== undefined) {
      fields.push("userId = ?");
      values.push(userId);
    }

    if (totalPrice !== undefined) {
      fields.push("totalPrice = ?");
      values.push(totalPrice);
    }

    if (fields.length > 0) {
      values.push(orderId);
      await db.query(`UPDATE orders SET ${fields.join(", ")} WHERE id = ?`, values);
    }

    if (orderItems && orderItems.length > 0) {
      for (const item of orderItems) {
        const { id: itemId, productId, quantity } = item;

        if (!itemId) continue;

        const itemFields = [];
        const itemValues = [];

        if (productId !== undefined) {
          itemFields.push("productId = ?");
          itemValues.push(productId);
        }

        if (quantity !== undefined) {
          itemFields.push("quantity = ?");
          itemValues.push(quantity);
        }

        if (itemFields.length > 0) {
          itemValues.push(itemId);
          await db.query(`UPDATE orderItems SET ${itemFields.join(", ")} WHERE id = ?`, itemValues);
        }
      }
    }

    const updated = await getOrderByField("id", orderId);
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating order:", error.message);
    return { error: "Internal server error" };
  }
};

// 🔹 Delete order by any field (defaults to id)
export const deleteOrders = async (field, value) => {
  try {
    const existingOrder = await getOrderByField(field, value);
    if (!existingOrder) {
      return { error: "Order not found" };
    }

    const orderId = existingOrder.id;

    await db.query("DELETE FROM orderItems WHERE orderId = ?", [orderId]);
    const [result] = await db.query("DELETE FROM orders WHERE id = ?", [orderId]);

    return { success: true, result };
  } catch (error) {
    console.error("Error deleting order:", error.message);
    return { error: "Internal server error" };
  }
};
