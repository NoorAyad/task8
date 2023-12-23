const client = require("../db");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();
//login
const login = async (req, res) => {
  try {
    let { username, password } = req.body;
    const result = await client.query(
      `SELECT * FROM users WHERE username = '${username}'`
    );

    if (result.rows.length === 0) {
      res.send({ success: false, msg: "User not found" });
    } else {
      let user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        var token = jwt.sign(user, process.env.USER_ACCESS_TOKEN);
        res.send({ success: true, token, user });
      } else {
        res.send({ success: false, msg: "Wrong password !..." });
      }
    }
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .send({ success: false, msg: "Internal Server Error...:", error });
  }
};

const registration = async (req, res) => {
  try {
    let { username, password, name, phone } = req.body;
    const hashPassword = bcrypt.hashSync(password, 6);

    let result = await client.query(
      `INSERT INTO users (username, password, name, phone) 
        VALUES ('${username}', '${hashPassword}', '${name}','${phone}') 
        RETURNING *`
    );

    user = result.rows[0];
    res.send({ success: true, user });
  } catch (error) {
    console.error("Error during registration:", error);

    // Handle the error response
    res.status(500).send({ success: false, msg: "Duplicated username", error });
  }
};

module.exports = { login, registration };
