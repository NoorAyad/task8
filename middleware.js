const jwt = require("jsonwebtoken");

async function checkAuthAdmin(req, res, next) {
  const token = req.headers.token;
  try {
    jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN);
    next();
  } catch (err) {
    res
      .status(401)
      .send({ success: false, msg: "Unauthorized!", error: err.message });
  }
}

async function checkAuthUser(req, res, next) {
  const token = req.headers.token;
  if (!token) return res.status(401).send({ message: "Access Denied!" });
  try {
    jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN);
    next();
  } catch (err) {
    try {
      jwt.verify(token, process.env.USER_ACCESS_TOKEN);

      next();
    } catch (err) {
      res.status(401).send({ message: "Access Denied!" });
      console.log(err);
    }
  }
}

module.exports = { checkAuthAdmin, checkAuthUser };
