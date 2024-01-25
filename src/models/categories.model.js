const db = require("../configs/postgre");
const response = require("../helpers/response");

const getCategory = () => {
  return new Promise((resolve, reject) => {
    db.query("select * from categories", (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
};

const createCategory = (values) => {
  return new Promise((resolve, reject) => {
    db.query(
      "insert into categories (name) values ($1) returning * ",
      [values],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
  });
};

const updateCategory = (categoryId, body) => {
  return new Promise((resolve, reject) => {
    const { name } = body;

    // Pastikan name ada sebelum melakukan pembaruan
    if (!name || name === "") {
      return reject(new Error('Field "name" is required for update.'));
    }

    db.query(
      "UPDATE categories SET name = $1,updated_at = CURRENT_TIMESTAMP  WHERE id = $2 RETURNING *",
      [name, categoryId], // Tukar posisi parameter $1 dan $2
      (error, result) => {
        if (error) {
          return reject(error);
        }

        // Memeriksa apakah ada kategori yang diperbarui
        if (result.rows.length > 0) {
          const updatedCategory = result.rows[0];
          //   console.log("Kategori berhasil diperbarui:", updatedCategory);
          resolve(updatedCategory);
        } else {
          //   console.log("Kategori dengan ID tersebut tidak ditemukan.");
          resolve(null);
        }
      }
    );
  });
};

const deleteCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [categoryId],
      (error, result) => {
        if (error) {
          return reject(error);
        }

        // Memeriksa apakah kategori berhasil dihapus
        if (result.rows.length > 0) {
          const deletedCategory = result.rows[0];
          console.log("Kategori berhasil dihapus:", deletedCategory);
          resolve(deletedCategory);
        } else {
          console.log("Kategori dengan ID tersebut tidak ditemukan.");
          resolve(null);
        }
      }
    );
  });
};

const getBookByCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT b.id,title,description,image_url as image,release_year,total_page,thickness,price,category_id, c.name as category_name,b.created_at,b.updated_at FROM book b JOIN categories c ON b.category_id = c.id WHERE c.id = $1",
      [categoryId],
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result.rows);
      }
    );
  });
};

const getDetailCtg = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "select * from categories WHERE id = $1";
    const values = [id];
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getBookByCategory,
  getDetailCtg,
};
