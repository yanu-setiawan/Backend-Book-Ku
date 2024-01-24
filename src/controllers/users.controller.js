const response = require("../helpers/response");
const userModel = require("../models/users.model");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  try {
    const result = await userModel.getUsers();
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.log(error);
  }
};

const insertUsers = async (req, res) => {
  try {
    // Cek apakah email sudah terdaftar
    const emailExists = await userModel.getEmail(req.body.email);
    if (emailExists.rows[0].sum > 0) {
      return res.status(400).json({
        msg: "Email / Phone Number sudah terdaftar",
      });
    }
    // Jika email belum terdaftar, lakukan insert
    const result = await userModel.register({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    res.status(201).json({
      data: result,
      msg: "User registered successfully!",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error cuy",
    });
  }
};

const login = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    const result = await userModel.loginUser(body.email);
    if (result.rows.length < 1)
      return res.status(401).json({
        msg: "Email/Password Salah",
      });
    const { password, role_id, email } = result.rows[0];
    console.log(result.rows[0]);
    const isPasswordValid = await bcrypt.compare(body.password, password);
    console.log(isPasswordValid);
    if (!isPasswordValid) return response(res, 401, "Invalid Password");

    response(res, 200, "Login Success", result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  getUsers,
  insertUsers,
  login,
};
