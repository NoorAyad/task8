const client = require("../db");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();

const login = async (req, res) => {
  try {
    let { username, password } = req.body;
    const result = await client.query(
      `SELECT * FROM admins WHERE username = '${username}'`
    );

    if (result.rows.length === 0) {
      res.send({ success: false, msg: "User not found" });
    } else {
      let admin = result.rows[0];
      const match = await bcrypt.compare(password, admin.password);

      if (match) {
        var token = jwt.sign(admin, process.env.ADMIN_ACCESS_TOKEN);
        res.send({ success: true, token, admin });
      } else {
        res.send({ success: false, msg: "Wrong password!" });
      }
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ success: false, msg: "Internal Server Error" });
  }
};

const registration = async (req, res) => {
  try {
    let { username, password, name, department } = req.body;
    const hashPassword = bcrypt.hashSync(password, 6); //salt =6

    let result = await client.query(
      `INSERT INTO admins ( name, username, department, password ) 
      VALUES ('${name}', '${username}', '${department}','${hashPassword}') 
      RETURNING *;`
    );

    const admin = result.rows[0];
    res.send({ success: true, admin });
  } catch (error) {
    console.error("Error during registration:", error);

    // Handle the error response
    res.status(500).send({ success: false, msg: "Duplicated username", error });
  }
};

module.exports = { login, registration };
