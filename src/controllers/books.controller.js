const bookModels = require("../models/books.model");
const response = require("../helpers/response");
const crypto = require("crypto");
const { uploader } = require("../utils/cloudinary");

const getAllBook = async (req, res) => {
  console.log(req.query);
  try {
    const result = await bookModels.getAllBook(req.query);
    response(res, 200, "Succesfully get book", result.rows);
  } catch (error) {
    console.log(error);
  }
};

const insertBook = async (req, res) => {
  try {
    let fileLink;
    // console.log(req.body);
    if (req.file) {
      const randomString = crypto.randomBytes(5).toString("hex");

      // get the file extension
      const ext = req.file.originalname.split(".").pop();
      const filename = `${randomString}.${ext}`;

      const { data, err, msg } = await uploader(req, "book", randomString);
      if (err) throw { msg, err };
      if (!data) return res.status(200).json({ msg: "No File Uploaded" });

      fileLink = data.secure_url;
    }
    const { body } = req;

    const releaseYear = parseInt(body.release_year, 10);
    if (isNaN(releaseYear) || releaseYear < 1980 || releaseYear > 2021) {
      return res.status(400).json({
        msg: "Invalid release year. Please provide a value between 1980 and 2021.",
      });
    }

    console.log(body);

    if (!body || !fileLink) {
      return res.status(400).json({ msg: "Input cannot be empty" });
    }
    let thickness = "";

    if (body.total_page <= 100) {
      thickness = "Tipis";
    } else if (body.total_page > 100 && body.total_page <= 200) {
      thickness = "Sedang";
    } else {
      thickness = "Tebal";
    }

    const result = await bookModels.insertBook(
      { ...body, thickness },
      fileLink
    );
    res.status(201).json({
      data: result.rows[0],
      msg: "Create Book success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Terjadi kesalahan pada server",
    });
  }
};

const cloudUpload = async (req, res) => {
  try {
    // upload ke cloud
    const { params } = req;
    const { data, err, msg } = await uploader(req, "books", params.id);
    if (err) throw { msg, err };
    if (!data) return res.status(200).json({ msg: "No File Uploaded" });
    return data;
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
  // console.log(error)
};

const updateBook = async (req, res) => {
  try {
    let fileLink;

    if (req.file) {
      const cloudResult = await cloudUpload(req, res, {
        prefix: "books",
        id: req.params.id,
      });
      fileLink = cloudResult.secure_url;
    }

    const { params, body } = req;

    // Calculate thickness based on total_page
    let thickness = "";
    if (body.total_page <= 100) {
      thickness = "Tipis";
    } else if (body.total_page > 100 && body.total_page <= 200) {
      thickness = "Sedang";
    } else {
      thickness = "Tebal";
    }

    // Set updated_at field in the body
    body.updated_at = new Date().toISOString();

    // Include thickness in the body
    body.thickness = thickness;

    const result = await bookModels.updateBook(params, body, fileLink);

    res.status(200).json({
      data: result.rows,
      msg: "Update successful",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const deleteBook = async (req, res) => {
  const bookId = req.params.id;

  try {
    const deleteBook = await bookModels.deleteBook(bookId);

    if (deleteBook !== null) {
      return response(res, 200, "Deleted Successfully ", deleteBook);
    } else {
      return response(res, 404, "Book Not found");
    }
  } catch (error) {
    return response(res, 500, "Internal Server error");
  }
};

const getBookDetail = async (req, res) => {
  try {
    const { params } = req;
    const result = await bookModels.getDetailBook(params.id);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: "Book not found",
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
  insertBook,
  getAllBook,
  cloudUpload,
  updateBook,
  deleteBook,
  getBookDetail,
};
