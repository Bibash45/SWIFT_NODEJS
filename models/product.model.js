import db from "../config/db.config.js";

// Create product
export const createProduct = async ({ name, price }) => {
  const [result] = await db.query(
    "INSERT INTO products (name, price) VALUES (?, ?)",
    [name, price]
  );
  return result;
};

// Update product by dynamic field
export const updateProductByField = async (field, value, product) => {
  const fields = [];
  const values = [];

  if (product.name !== undefined) {
    fields.push("name = ?");
    values.push(product.name);
  }

  if (product.price !== undefined) {
    fields.push("price = ?");
    values.push(product.price);
  }

  if (fields.length === 0) {
    throw new Error("No fields provided for update.");
  }

  values.push(value); // for WHERE clause
  const query = `UPDATE products SET ${fields.join(", ")} WHERE ${field} = ?`;
  const [result] = await db.query(query, values);
  return result;
};

// Delete product by dynamic field
export const deleteProductByField = async (field, value) => {
  // Check if the product exists
  const existingProduct = await getProductByField(field, value);
  const [result] = await db.query(`DELETE FROM products WHERE ${field} = ?`, [
    value,
  ]);

  return result;
};

// Get all products
export const getAllProducts = async () => {
  const [rows] = await db.query("SELECT * FROM products");
  return rows;
};

// Get product by dynamic field
export const getProductByField = async (field, value) => {
  const query = `SELECT * FROM products WHERE ${field} = ?`;
  const [rows] = await db.query(query, [value]);
  if (rows.length === 0) {
    throw new Error("Product not found");
  }
  return rows[0];
};
