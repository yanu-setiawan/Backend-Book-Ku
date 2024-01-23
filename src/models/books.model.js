const db = require("../configs/postgre");

const getAllBook = (query) => {
  return new Promise((resolve, reject) => {
    let sqlQuery = `
      SELECT b.id, b.title, b.description, b.image_url as image, b.release_year, b.total_page, b.thickness, b.price, b.category_id, c.name as category_name, b.created_at, b.updated_at
      FROM book b
      JOIN categories c ON b.category_id = c.id 
      `;
    let params = " ";

    if (query.search) {
      params += `AND LOWER(b.title) LIKE LOWER('%${query.search}%') `;
    }

    if (query.minYear) {
      params += `AND b.release_year >= ${query.minYear} `;
    }

    if (query.maxYear) {
      params += `AND b.release_year <= ${query.maxYear} `;
    }

    if (query.minPage) {
      params += `AND b.total_page >= ${query.minPage} `;
    }

    if (query.maxPage) {
      params += `AND b.total_page <= ${query.maxPage} `;
    }

    if (query.order) {
      if (query.order === "asc") {
        params += "order by title ASC ";
      }
      if (query.order === "desc") {
        params += "order by title DESC ";
      }
    }

    sqlQuery += params;
    db.query(sqlQuery, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
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

const updateBook = (params, body, fileLink) => {
  return new Promise((resolve, reject) => {
    const updateEntries = {};
    const values = [];
    let setClause = "";

    if (body.title) {
      updateEntries.title = body.title;
      values.push(body.title);
      setClause += "title = $" + values.length + ", ";
    }

    if (body.description) {
      updateEntries.description = body.description;
      values.push(body.description);
      setClause += "description = $" + values.length + ", ";
    }

    if (fileLink) {
      updateEntries.image = fileLink;
      values.push(fileLink);
      setClause += "image_url = $" + values.length + ", ";
    }

    if (body.release_year) {
      updateEntries.release_year = body.release_year;
      values.push(body.release_year);
      setClause += "release_year = $" + values.length + ", ";
    }

    if (body.price) {
      updateEntries.price = body.price;
      values.push(body.price);
      setClause += "price = $" + values.length + ", ";
    }

    if (body.total_page) {
      updateEntries.total_page = body.total_page;
      values.push(body.total_page);
      setClause += "total_page = $" + values.length + ", ";
    }

    if (body.thickness) {
      updateEntries.thickness = body.thickness;
      values.push(body.thickness);
      setClause += "thickness = $" + values.length + ", ";
    }

    if (body.category_id) {
      updateEntries.category_id = body.category_id;
      values.push(body.category_id);
      setClause += "category_id = $" + values.length + ", ";
    }

    updateEntries.updated_at = new Date().toISOString();
    values.push(updateEntries.updated_at);
    setClause += "updated_at = $" + values.length + ", ";

    setClause = setClause.slice(0, -2);

    values.push(params.id);

    const sql =
      "UPDATE book SET " +
      setClause +
      " WHERE id = $" +
      values.length +
      " RETURNING *";

    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const deleteBook = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE from book where id = $1 RETURNING*";
    const values = [id];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result.rows);
    });
  });
};

module.exports = {
  insertBook,
  getAllBook,
  updateBook,
  deleteBook,
};
