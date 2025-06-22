import db from "../config/db.config.js";
import bcrypt from "bcryptjs";

// CREATE user dynamically
export const createUser = async (data) => {
  const columns = Object.keys(data);
  const values = Object.values(data);

  // Hash the password if it exists
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const passwordIndex = columns.indexOf("password");
    values[passwordIndex] = hashedPassword;
  }

  const placeholders = columns.map(() => "?").join(", ");
  const sql = `INSERT INTO users (${columns.join(
    ", "
  )}) VALUES (${placeholders})`;

  const [result] = await db.query(sql, values);
  return result;
};

// READ all users
export const getAllUsers = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const [data] = await db.query("SELECT * FROM users LIMIT ? OFFSET ?", [
    limit,
    offset,
  ]);
  const [countResult] = await db.query("SELECT COUNT(*) as total FROM users");

  return {
    users: data,
    meta: {
      total: countResult[0].total,
      currentPage: page,
      totalPages: Math.ceil(countResult[0].total / limit),
    },
  };
};

// GET user by any field (e.g., email, id, etc.)
export const getUserByField = async (field, value) => {
  const sql = `SELECT * FROM users WHERE ${field} = ? LIMIT 1`;
  const [rows] = await db.query(sql, [value]);
  return rows[0];
};

// GET user by multiple filters (optional for future use)
export const getUsersByFields = async (filters) => {
  const fields = Object.keys(filters);
  const values = Object.values(filters);
  const conditions = fields.map((field) => `${field} = ?`).join(" AND ");
  const sql = `SELECT * FROM users WHERE ${conditions}`;
  const [rows] = await db.query(sql, values);
  return rows;
};

// UPDATE user dynamically by id
export const updateUser = async (id, data) => {
  const fields = Object.keys(data);
  const values = Object.values(data);
  if (fields.length === 0) throw new Error("No valid fields provided");
  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  values.push(id);
  const sql = `UPDATE users SET ${setClause} WHERE id = ?`;
  const [result] = await db.query(sql, values);
  return result;
};

// DELETE user by id
export const deleteUser = async (id) => {
  const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
  return result;
};
