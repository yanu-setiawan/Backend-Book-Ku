const db = require("../configs/postgre");

const getAllBook = () => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT b.id,title,description,image_url as image,release_year,total_page,thickness,price,category_id, c.name as category_name,b.created_at,b.update_at FROM book b JOIN categories c ON b.category_id = c.id ",
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
  });
};

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
  getAllBook,
};
