import {
  createUser,
  getAllUsers,
  getUserByField,
  updateUser,
  deleteUser,
} from "../query/user.query.js";

// Register a new user (dynamic)
export const registerUser = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await getUserByField("email", email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const result = await createUser(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const users = await getAllUsers(page, limit);
    res.status(200).json({
      success: true,
      data: { ...users },
    });
  } catch (err) {
    console.error("Get Users Error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Get user by any field
export const getUserByFieldController = async (req, res) => {
  const { field, value } = req.query;
  try {
    if (!field || !value) {
      return res.status(400).json({
        success: false,
        message: "Field and value are required in query",
      });
    }

    const user = await getUserByField(field, value);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("Get User Error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Delete user by any field
export const deleteUserByField = async (req, res) => {
  const { field, value } = req.query;
  try {
    if (!field || !value) {
      return res.status(400).json({
        success: false,
        message: "Field and value are required in query",
      });
    }

    const user = await getUserByField(field, value);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const result = await deleteUser(user.id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Update user by any field
export const updateUserByField = async (req, res) => {
  const { field, value } = req.query;
  const updatedData = req.body;

  try {
    if (!field || !value) {
      return res.status(400).json({
        success: false,
        message: "Field and value are required in query",
      });
    }

    if (!updatedData || Object.keys(updatedData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    const user = await getUserByField(field, value);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const result = await updateUser(user.id, updatedData);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
