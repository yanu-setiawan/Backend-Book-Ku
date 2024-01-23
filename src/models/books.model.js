const db = require("../configs/postgre");

const insertBook = (body, fileLink) => {
  return new Promise((resolve, reject) => {
    const sql =
      "insert into book (title, description,image_url,release_year,price,total_page,thickness,category_id) values ($1, $2, $3,$4,$5,$6,$7,$8) RETURNING *";
    const values = [
      body.title,
      body.description,
      fileLink,
      body.release_year,
      body.price,
      body.total_page,
      body.thickness,
      body.category_id,
    ];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  insertBook,
};
