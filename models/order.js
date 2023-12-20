const client = require("../db");

const getOrders = async (req, res) => {
  try {
    const result = await client.query(`SELECT * FROM orders
  ORDER BY order_date ASC;
  `);
    res.send({ success: true, orders: result.rows });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

const addOrders = async (req, res) => {
  const { items, userID, address } = req.body;
  const order_date = new Date().toISOString().split("T")[0]; // Format to 'YYYY-MM-DD'

  try {
    const result = await client.query(`
        INSERT INTO orders(items, user_id, address, order_date, status)
        VALUES('${items}', ${userID}, '${address}', '${order_date}', 'PENDING')
        RETURNING *;
      `);

    const newOrder = result.rows[0];
    res.send({ success: true, newOrder });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

const changeStatus = async (req, res) => {
  const id = parseInt(req.params.id);
  const status = req.body.status;

  try {
    const result = await client.query(`
    UPDATE orders
    SET status ='${status}'
    WHERE id = ${id}
    RETURNING *;
      `);

    const order = result.rows[0];
    res.send({ success: true, order });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

module.exports = { getOrders, addOrders, changeStatus };
