require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

let products = [];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

app.post("/add-product", upload.single("image"), (req, res) => {
  const { user, pass } = req.body;

  if (user !== ADMIN_USER || pass !== ADMIN_PASS)
    return res.status(401).json({ error: "Unauthorized" });

  const product = {
    id: Date.now(),
    name: req.body.name,
    price: req.body.price,
    link: req.body.link,
    image: "uploads/" + req.file.filename
  };

  products.push(product);

  res.json({ message: "Product added successfully", product });
});

app.get("/products", (req, res) => {
  res.json(products);
});

app.listen(4000, () => console.log("Backend running on port 4000"));
