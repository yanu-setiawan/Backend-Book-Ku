const categoriesModel = require("../models/categories.model");
const response = require("../helpers/response");

const getCategory = async (req, res) => {
  try {
    const result = await categoriesModel.getCategory();
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.log(error);
  }
};

const createCategory = async (req, res) => {
  const { body } = req;

  try {
    if (!body.name || body.name === "") {
      return response(res, 400, "Invalid input");
    }
    const result = await categoriesModel.createCategory(body.name);
    return response(res, 201, "Category added", result.rows);
  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};

const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const categoryValues = req.body;

  try {
    const updatedCategory = await categoriesModel.updateCategory(
      categoryId,
      categoryValues
    );

    if (!categoryValues || categoryValues === "") {
      return response(res, 400, "Invalid input");
    }

    if (updatedCategory !== null) {
      return res.status(200).json({
        success: true,
        message: "Kategori berhasil diperbarui.",
        data: updatedCategory,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Kategori dengan ID tersebut tidak ditemukan.",
      });
    }
  } catch (error) {
    // console.error("Gagal memperbarui kategori:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan internal saat memperbarui kategori.",
    });
  }
};

const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const deletedCategory = await categoriesModel.deleteCategory(categoryId);

    if (deletedCategory !== null) {
      return res.status(200).json({
        success: true,
        message: "Kategori berhasil dihapus.",
        data: deletedCategory,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Kategori dengan ID tersebut tidak ditemukan.",
      });
    }
  } catch (error) {
    console.error("Gagal menghapus kategori:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan internal saat menghapus kategori.",
    });
  }
};

const getBookByCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const book = await categoriesModel.getBookByCategory(categoryId);

    if (book !== null) {
      return response(res, 200, "Data Success Loaded", book);
    } else {
      return response(res, 404, "Book Not Found");
    }
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error");
  }
};

const getCtgDetail = async (req, res) => {
  try {
    const { params } = req;
    const result = await categoriesModel.getDetailCtg(params.id);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: "Categories not found",
      });
      return;
    }
    res.status(200).json({
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getBookByCategory,
  getCtgDetail,
};
