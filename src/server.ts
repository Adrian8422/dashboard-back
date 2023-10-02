import express from "express";
import cors from "cors";
import { sequelize } from "./lib/connection/db/postgres";
import { findUserOrCreateUser, sendCode, signInUser } from "./controllers/auth";
import { authMiddleware } from "./lib/middlewares/authentication";
import { meData, updateMeData } from "./controllers/meData";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  getProductId,
  deleteProduct,
} from "./controllers/products";
import { Product } from "./models/product";

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use(cors());
// SECTION USER
app.post("/signup", async (req, res) => {
  const { email, age, rol } = req.body;

  const createUser = await sendCode(email);

  res.send(createUser);
});
app.post("/signin", async (req, res) => {
  const { email, code } = req.body;
  const response = await signInUser(email, code).catch((err) =>
    res.status(401).send(err)
  );

  res.send(response);
});
app.get("/me", authMiddleware, async (req: any, res) => {
  const { email, rol } = req.user;
  const user: any = await meData(email, rol).catch((err) =>
    res.status(401).send(err)
  );
  console.log(user);
  res.send(user.dataValues);
});
// In this endpoint we can modified only the global data, we can't modify fields such as 'email' and 'rol'
app.patch("/update-user", authMiddleware, async (req: any, res) => {
  try {
    if (!req.user) throw "User not found";
    const { id, email, rol } = req.user;
    const newValues = req.body;

    const updateUser = await updateMeData({ email, rol, id }, newValues);
    res.send(updateUser);
  } catch (error) {
    res.status(401).send(error);
  }
});
// SECTION PRODUCT

app.get("/products", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch (error) {
    res.status(401).send(error);
  }
});
app.get("/product/:id", async (req, res) => {
  console.log("entra?");
  try {
    const { id } = req.params;
    const product = await getProductId(id);
    res.send(product);
  } catch (error) {
    res.status(401).send(error);
  }
});

app.post("/create-product", authMiddleware, async (req: any, res) => {
  try {
    if (!req.user || req.user.rol !== "admin")
      throw "User not found or your admin role isn't";

    const dataProduct = req.body;
    const newProduct = await createProduct(dataProduct).catch((err: any) => {
      res.status(401).send(err);
    });
    res.send(newProduct);
  } catch (error) {
    res.status(401).send(error);
  }
});
app.patch("/update-product/:id", authMiddleware, async (req: any, res) => {
  try {
    if (!req.user || req.user.rol !== "admin")
      throw "User not found or your admin role isn't";
    const dataValues = req.body;
    const { id } = req.params;

    const updatedProduct = await updateProduct(id, dataValues).catch((err) => {
      res.status(404).json({ message: err });
    });

    res.send(updatedProduct);
  } catch (error) {
    res.status(401).send(error);
  }
});

app.delete("/delete-product/:id", authMiddleware, async (req: any, res) => {
  try {
    if (!req.user || req.user.rol !== "admin")
      throw "User not found or your admin role isn't";
    const { id } = req.params;
    const deletedProduct = await deleteProduct(id).catch((err) =>
      res.status(404).send(err)
    );
    if (!deletedProduct) throw "Product was not deleted";
    res.send(deletedProduct);
  } catch (error) {
    res.status(404).send(error);
  }
});

app.listen(port, () =>
  console.log("service connected http://localhost:" + port)
);
// sequelize.sync({ force: true });
