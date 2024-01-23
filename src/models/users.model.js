const db = require("../configs/postgre");

const getUsers = () => {
  return new Promise((resolve, reject) => {
    db.query("select * from users", (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
};

const register = (data) => {
  return new Promise((resolve, reject) => {
    const sql =
      "insert into users (email, password,role_id) values ($1, $2,2) RETURNING *";
    const values = [data.email, data.password];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result.rows);
    });
  });
};

const getEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT count(*) as sum FROM users WHERE email = $1";
    const values = [email];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const loginUser = (email) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT email,password,role_id FROM users u WHERE email=$1";
    db.query(sql, [email], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  getUsers,
  register,
  getEmail,
  loginUser,
};
