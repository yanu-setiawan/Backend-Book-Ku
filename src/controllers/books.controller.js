const bookModels = require("../models/books.model");
const response = require("../helpers/response");
const crypto = require("crypto");
const { uploader } = require("../utils/cloudinary");

const getAllBook = async (req, res) => {
  try {
    const result = await bookModels.getAllBook();
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
      // Unggah file ke cloud
      // generate a random string of length 10
      const randomString = crypto.randomBytes(5).toString("hex");

      // get the file extension
      const ext = req.file.originalname.split(".").pop();

      // create a filename using the random string and file extension
      const filename = `${randomString}.${ext}`;

      const { data, err, msg } = await uploader(req, "book", randomString);
      if (err) throw { msg, err };
      if (!data) return res.status(200).json({ msg: "No File Uploaded" });

      fileLink = data.secure_url;
      //   console.log("fl", fileLink);
    }
    const { body } = req;

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

module.exports = {
  insertBook,
  getAllBook,
};
