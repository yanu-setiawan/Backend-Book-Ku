const userModel = require("../models/users.model");
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

module.exports = {
  getUsers,
};
