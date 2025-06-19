import db from "../config/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.config.js";

// login
export const loginController = async (req, res) => {
  try {
    if (!req?.body?.email || !req?.body?.password) {
      return res.status(400).json({
        success: false,
        message: "Missing email or password",
      });
    }
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing email or password" });
    }
    const [result] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (result.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid email" });
    }
    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    res.status(200).json({ success: true, data: userResponse });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// logout
export const logoutController = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
