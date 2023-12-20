const client = require("../db");

const Products = async (req, res) => {
  let search = req.query.search || "";
  const skip = parseInt(req.query.skip) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (skip < 1 || limit < 1) {
    return res.status(400).send({
      success: false,
      message:
        "Invalid pagination parameters. Skip and limit must be positive integers.",
    });
  }

  const offset = parseInt((skip - 1) * limit);

  try {
    const result = await client.query(
      `SELECT * FROM products 
        WHERE name ILIKE '%${search}%' AND active = true 
        ORDER BY name ASC
        LIMIT ${limit} OFFSET ${offset};`
    );
    res.send({ success: true, products: result.rows });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const addProducts = async (req, res) => {
  const { name, price, discount, description } = req.body;
  const image = upload(req, res) || "no image";
  try {
    const result = await client.query(
      `INSERT INTO products(name, price, discount, image, active, description)
      VALUES('${name}', ${price}, ${discount},'${image}', true,'${description}') 
      RETURNING *`
    );

    const newProduct = result.rows[0];

    res.send({
      success: true,
      newProduct,
    });
  } catch (error) {
    console.error("Error during addition, ", error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateProducts = async (req, res) => {
  const id = req.params.id;
  const { name, price, discount, image, active, description } = req.body;

  try {
    const result = await client.query(`
        UPDATE products
        SET name = '${name}', price = ${price}, discount = ${discount}, image = '${image}', active = ${active}, description = '${description}'
        WHERE id = ${id}
        RETURNING *;
      `);
    if (result.rowCount > 0) {
      const updatedProduct = result.rows[0];
      res.send({
        success: true,
        updatedProduct,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteProducts = async (req, res) => {
  let id = req.params.id;
  const result = await client.query(
    `UPDATE products
     SET active = false
     WHERE id = ${id}
     RETURNING *;`
  );
  const deletedProduct = result.rows[0];
  res.send({
    success: true,
    msg: "deleted successfully",
    deletedProduct,
  });
};

// const upload = (req, res) => {
//   var uploadedFile;
//   if (!req.files.foo) {
//     req.files.foo = "no image";
//     uploadedFile = req.files.foo;
//   } else {
//     uploadedFile = req.files.foo;
//   }
//   const filePath = `images/${Date.now() + uploadedFile.name}`;

//   uploadedFile.mv(filePath, (err) => {
//     if (err) {
//       return res.status(500).send({ err });
//     } else {
//       res.status(200).send("File uploaded");
//       return filePath;
//     }
//   });
// };

module.exports = { Products, addProducts, updateProducts, deleteProducts };
