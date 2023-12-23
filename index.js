const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const orders = require("./routers/orders");
const products = require("./routers/products");
const admins = require("./routers/admins");
const users = require("./routers/users");
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors())

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

app.use("/api/v1", products);
app.use("/api/v1", admins);
app.use("/api/v1", orders);
app.use("/api/v1", users);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
