import express, { Request, Response } from "express";

import cors from "cors";
import { sequelize } from "./lib/connection/db/postgres";
import {
  changeRol,
  findUserOrCreateUser,
  sendCode,
  signInUser,
} from "./controllers/auth";
import {
  authMiddleware,
  checkAdminMiddleware,
} from "./lib/middlewares/authentication";
import { meData, updateMeData } from "./controllers/meData";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  getProductId,
  deleteProduct,
} from "./controllers/products";
import { Product } from "./models/product";
import {
  createSupplier,
  deleteSupplier,
  getSupplierId,
  getSuppliers,
  updateSupplier,
} from "./controllers/supplier";
import {
  createCategorie,
  allCategories,
  categorieById,
  updateCategorie,
  deleteCategorie,
} from "./controllers/categorie";
import {
  createSale,
  updateSale,
  allSales,
  getSaleId,
  deleteSale,
  getSalesPerDay,
} from "./controllers/sales";
import {
  completeTask,
  deleteManyTasks,
  createTask,
  deleteTask,
  getTaskId,
  getTasks,
  updateTask,
} from "./controllers/tasks";
import { getNotifications } from "./controllers/notification";
import { getUsers } from "./controllers/user";

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
const corsOptions = {
  origin: [
    "https://dashboard-front-8ak1.vercel.app",
  ],
};

app.use(cors(corsOptions));

// SECTION USER
app.post("/signup", async (req, res) => {
  const { email, age, rol, name, lastname } = req.body;

  const createUser = await sendCode({ email, age, name, lastname });

  res.send(createUser);
});
app.post("/signin", async (req: any, res) => {
  try {
    const { email, code } = req.body;
    const response = await signInUser(email, code);
    res.send(response);
  } catch (error: any) {
    if (error.message == "Auth not found or throw code") {
      res.status(404).send({ error: error.message });
    } else if (error.message == "Code expired, please generate a new code") {
      res.status(401).send({ error: error.message });
    } else if (
      error.message == "Throw verification, please generate a new code"
    ) {
      res.status(400).send({ error: error.message });
    } else res.status(500).send({ error: error.message });
  }
});
app.get("/me", authMiddleware, async (req: any, res) => {
  try {
    if (!req.user) {
      res
        .status(401)
        .send({ error: "User not found or your admin role isn't" });
      return new Error("User not found or your admin role isn't");
    }
    const { email, rol } = req.user;
    const user: any = await meData(email, rol);

    res.send(user.dataValues);
  } catch (error: any) {
    if (error.message == "User not found") {
      res.status(404).send({ error: error.message });
    } else {
      res.status(500).send({ error: error.message });
    }
  }
});
// In this endpoint we can modified only the global data, we can't modify fields such as 'email' and 'rol'
app.patch("/update-user", authMiddleware, async (req: any, res) => {
  try {
    if (!req.user) {
      res
        .status(401)
        .send({ error: "User not found or your admin role isn't" });
      return new Error("User not found or your admin role isn't");
    }
    const { id, email, rol } = req.user;

    const dataValues = req.body;

    if (!dataValues || Object.keys(dataValues).length === 0) {
      res.status(400).send({ error: "Body is required" });
      return;
    }

    const updateUser = await updateMeData({ email, rol, id }, dataValues);
    res.send(updateUser);
  } catch (error: any) {
    if (error.message == "User not found") {
      res.status(404).send({ error: error.message });
    } else {
      res.status(500).send({ error: error.message });
    }
  }
});

app.patch(
  "/change-rol/:id",
  authMiddleware,
  checkAdminMiddleware,
  async (req: any, res) => {
    try {
      console.log(req.user);
      const { id } = req.params;
      const { rol } = req.body;
      console.log(id, rol);

      const response = await changeRol(id, rol);
      res.send(response);
    } catch (error: any) {
      if (error.message == "Throw values rol")
        res.status(402).send({ error: error.message });
      else if (error.message == "User not found")
        res.status(404).send({ error: error.message });
      else res.status(500).send({ error: error.message });
    }
  }
);

// SECTION PRODUCT

app.get("/products", authMiddleware, async (req: any, res) => {
  console.log("ENTRO ACAAA");
  try {
    if (!req.user) {
      res.status(401).send({ error: "User not found" });
      return new Error("User not found");
    }

    const products = await getAllProducts();
    res.send(products);
  } catch (error: any) {
    if (error.message == "Product id not found") {
      res.status(401).send({ error: error.message });
    } else {
      res.status(500).send({
        error: error.message,
      });
    }
  }
});
app.get("/product/:id", authMiddleware, async (req: any, res) => {
  try {
    if (!req.user) {
      res.status(401).send({ error: "User not found" });
      return new Error("User not found");
    }
    const { id } = req.params;
    const product = await getProductId(id);
    res.send(product);
  } catch (error: any) {
    if (error.message == "Product id not found") {
      res.status(404).send({ error: error.message });
    } else {
      res.status(500).send({ error: error.message });
    }
  }
});

app.post("/create-product", authMiddleware, async (req: any, res) => {
  try {
    if (!req.user || req.user.rol !== "admin") {
      res
        .status(401)
        .send({ error: "User not found or your admin role isn't" });
      return new Error("User not found or your admin role isn't");
    }
    const { email } = req.user;
    const dataProduct = req.body;
    const newProduct = await createProduct(dataProduct, email).catch(
      (err: any) => {
        res.status(401).send(err);
      }
    );
    res.send(newProduct);
  } catch (error: any) {
    if (error.message == "We can't create this product") {
      res.status(402).send({ error: error.message });
    } else {
      res.status(500).send({ error: error.message });
    }
  }
});
app.patch("/update-product/:id", authMiddleware, async (req: any, res) => {
  try {
    if (!req.user || req.user.rol !== "admin") {
      res
        .status(401)
        .send({ error: "User not found or your admin role isn't" });
      return new Error("User not found or your admin role isn't");
    }
    const dataValues = req.body;
    const { id } = req.params;
    if (!dataValues || Object.keys(dataValues).length === 0) {
      res.status(400).send({ error: "Body is required" });
      return;
    }

    const updatedProduct = await updateProduct(id, dataValues);

    res.send(updatedProduct);
  } catch (error: any) {
    if (error.message == "Product not found") {
      res.status(404).send({ error: error.message });
    } else if (error.message == "Failed update product") {
      res.status(402).send({ error: error.message });
    } else {
      res.status(500).send({ error: error.message });
    }
  }
});

app.delete("/delete-product/:id", authMiddleware, async (req: any, res) => {
  try {
    if (!req.user || req.user.rol !== "admin") {
      res
        .status(401)
        .send({ error: "User not found or your admin role isn't" });
      return new Error("User not found or your admin role isn't");
    }
    const { id } = req.params;
    const deletedProduct = await deleteProduct(id);

    res.send(deletedProduct);
  } catch (error: any) {
    if (error.message == "product not found") {
      res.status(404).send({ error: error.message });
    } else if (error.message == "Could not be deleted") {
      res.status(402).send({ error: error.message });
    } else {
      res.status(500).send({ error: error.message });
    }
  }
});

// SECTION SUPPLIER

app.post("/create-supplier", authMiddleware, async (req: any, res) => {
  try {
    if (
      !req.user ||
      Object.keys(req.user).length === 0 ||
      req.user.rol !== "admin"
    ) {
      res
        .status(401)
        .send({ error: "User not found or your admin role isn't" });
      return new Error("User not found or your admin role isn't");
    }
    const dataValues = req.body;
    if (!dataValues || Object.keys(dataValues).length === 0) {
      res.status(400).send({ error: "Body is required" });
      return;
    }
    const newSupplier = await createSupplier(dataValues);
    if (!newSupplier) {
      res.status(401).send("We couldn't create this supplier");
      throw "We couldn't create this supplier ";
    }
    res.send(newSupplier);
  } catch (error: any) {
    if (
      error.message ==
      "We did not create this supplier, because it already exists"
    ) {
      res.status(404).send({ error: error.message });
    } else {
      res.status(500).send({
        error: error.message,
      });
    }
  }
});
app.patch("/update-supplier/:id", authMiddleware, async (req: any, res) => {
  try {
    if (!req.user || req.user.rol !== "admin") {
      res
        .status(401)
        .send({ error: "User not found or your admin role isn't" });
      return new Error("User not found or your admin role isn't");
    }
    const { id } = req.params;
    const dataValues = req.body;

    if (!dataValues || Object.keys(dataValues).length === 0) {
      res.status(400).send({ error: "Body is required" });
      return;
    }

    const newSupplier = await updateSupplier(id, dataValues);

    res.send(newSupplier);
  } catch (error: any) {
    if (error.message == "Suppliers not found") {
      res.status(404).send({ error: error.message });
    } else if (error.message == "We couldn't update this supplier") {
      res.status(401).send({ error: error.message });
    } else {
      res.status(500).send({
        error: error.message,
      });
    }
  }
});

app.get("/suppliers", authMiddleware, async (req: any, res) => {
  try {
    if (!req.user || req.user.rol !== "admin") {
      res
        .status(401)
        .send({ error: "User not found or your admin role isn't" });
      return new Error("User not found or your admin role isn't");
    }
    const suppliers = await getSuppliers();
    res.send(suppliers);
  } catch (error: any) {
    if (error.message == "Suppliers not found") {
      res.status(404).send({ error: error.message });
    } else {
      res.status(500).send({
        error: error.message,
      });
    }
  }
});
app.get("/supplier/:id", authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    if (!req.user || req.user.rol !== "admin") {
      res
        .status(401)
        .send({ error: "User not found or your admin role isn't" });
      return new Error("User not found or your admin role isn't");
    }
    const suppliers = await getSupplierId(id);
    res.send(suppliers);
  } catch (error: any) {
    if (error.message == "Supplier id not found") {
      res.status(404).send({ error: error.message });
    } else {
      res.status(500).send({
        error: error.message,
      });
    }
  }
});
app.delete("/delete-supplier/:id", authMiddleware, async (req: any, res) => {
  try {
    if (!req.user || req.user.rol !== "admin") {
      res
        .status(401)
        .send({ error: "User not found or your admin role isn't" });
      return new Error("User not found or your admin role isn't");
    }

    const { id } = req.params;
    const { message } = await deleteSupplier(id);

    if (message === "Succesfull deleted supplier") {
      res.send("deleted successfully");
    }
  } catch (error: any) {
    console.log(error.message); // Accede al mensaje de error

    if (error.message === "Supplier not found") {
      res.status(404).send({ error: "Supplier not found" });
    } else {
      res.status(500).send({
        error: error.message,
      });
    }
  }
});

// Section categories

app.post("/create-categorie", authMiddleware, async (req: any, res) => {
  try {
    if (!req.user || req.user.rol !== "admin") {
      res
        .status(401)
        .send({ error: "User not found or your admin role isn't" });
      return new Error("User not found or your admin role isn't");
    }
    const dataValues = req.body;
    if (!dataValues || Object.keys(dataValues).length === 0) {
      res.status(405).send({ error: "Body is required" });
      return;
    }

    const categorie = await createCategorie(dataValues);
    res.send(categorie);
  } catch (error: any) {
    if (error.message == "We can't create this categorie") {
      res.status(400).send({ error: error.message });
    } else if (
      error.message ==
      "We did not create this supplier, because it already exists"
    ) {
      res.status(401).send({ error: error.message });
    } else {
      console.log("entro aqui? :D");
      res.status(500).send({ error: error.message });
    }
  }
});
app.get("/categories", authMiddleware, async (req: any, res) => {
  try {
    if (!req.user) {
      res.status(401).send({ error: "User not found" });
      return new Error("User not found");
    }
    const categories = await allCategories();
    res.send(categories);
  } catch (error: any) {
    if (error.message == "We didn't find any categorie") {
      res.status(404).send({ error: error.message });
    } else {
      res.status(500).send({ error: error.message });
    }
  }
});
app.get("/categorie/:id", authMiddleware, async (req: any, res) => {
  try {
    if (!req.user) {
      res.status(401).send({ error: "User not found" });
      return new Error("User not found");
    }
    const { id } = req.params;
    const categorie = await categorieById(id);
    res.send(categorie);
  } catch (error: any) {
    if (error.message == "Categorie not found") {
      res.status(404).send({ error: error.message });
    }
  }
});
app.patch(
  "/update-categorie/:id",
  authMiddleware,
  checkAdminMiddleware,
  async (req: any, res) => {
    try {
      const { id } = req.params;
      const dataValues = req.body;
      if (!dataValues || Object.keys(dataValues).length === 0) {
        res.status(400).send({ error: "Body is required" });
        return;
      }
      const categorie = await updateCategorie(id, dataValues);

      res.send(categorie);
    } catch (error: any) {
      if (error.message == "Categorie not found") {
        res.status(404).send({ error: error.message });
      } else if (error.message == "We didn't update this categorie") {
        res.status(402).send({ error: error.message });
      } else {
        res.status(500).send({ error: error.message });
      }
    }
  }
);
app.delete(
  "/delete-categorie/:id",
  authMiddleware,
  checkAdminMiddleware,
  async (req: any, res) => {
    try {
      const { id } = req.params;
      const { message } = await deleteCategorie(id);
      res.send(message);
    } catch (error: any) {
      if (error.message == "Categorie not found")
        res.status(404).send({ error: error.message });
      else res.status(500).send({ error: error.message });
    }
  }
);

// Section SALES

app.get("/sales", authMiddleware, async (req, res) => {
  try {
    const sales = await allSales();
    res.send(sales);
  } catch (error: any) {
    if (error.message == "Sales not found")
      res.status(404).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
});
app.get("/sales-per-day", authMiddleware, async (req, res) => {
  try {
    const sales = await getSalesPerDay();
    res.send(sales);
  } catch (error: any) {
    if (error.message == "Sales not found")
      res.status(404).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
});
app.get("/sale/:id", authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const sale = await getSaleId(id);
    res.send(sale);
  } catch (error: any) {
    if (error.message == "Sale not found")
      res.status(404).send({ error: error.message });
  }
});

app.post(
  "/:productId/create-sale",
  authMiddleware,
  checkAdminMiddleware,
  async (req: any, res) => {
    try {
      const dataValues = req.body;
      if (!dataValues || Object.keys(dataValues).length === 0) {
        res.status(400).send({ error: "Body is required" });
        return;
      }
      const { productId } = req.params;
      const sale = await createSale(productId, dataValues);
      res.send(sale);
    } catch (error: any) {
      if (error.message == "We need data for to create this sale")
        res.status(402).send({ error: error.message });
      else if (error.message == "We didn't create this sale")
        res.status(402).send({
          error: error.message,
        });
      else res.status(500).send({ error: error.message });
    }
  }
);
app.patch(
  "/update-sale/:id",
  authMiddleware,
  checkAdminMiddleware,
  async (req: any, res) => {
    try {
      const { email } = req.user;
      const dataValues = req.body;
      const { id } = req.params;
      if (!dataValues || Object.keys(dataValues).length === 0) {
        res.status(400).send({ error: "Body is required" });
        return;
      }
      const sale = await updateSale(id as string, dataValues, email);
      res.send(sale);
    } catch (error: any) {
      if (error.message == "Sale not found")
        res.status(404).send({ error: error.message });
      else if (error.message == "Error, we didn't update this 'sale'")
        res.status(404).send({ error: error.message });
      else res.status(500).send({ error: error.message });
    }
  }
);
app.delete(
  "/delete-sale/:id",
  authMiddleware,
  checkAdminMiddleware,
  async (req: any, res) => {
    try {
      const { id } = req.params;
      const { message } = await deleteSale(id);
      res.send(message);
    } catch (error: any) {
      if (error.message == "Sale not found")
        res.status(404).send({ error: error.message });
      else res.status(500).send({ error: error.message });
    }
  }
);
// TASKS SECTION

app.post("/create-task", authMiddleware, async (req: any, res) => {
  try {
    const { email } = req.user;
    const data = req.body;
    const response = await createTask(data, email);
    res.send(response);
  } catch (error: any) {
    if (error.message == "You need to be login")
      res.status(401).send({ error: error.message });
    else if (error.message == "We could't create this task")
      res.status(402).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
});
app.patch("/update-task/:id", authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user;
    const data = req.body;
    const response = await updateTask(id, data, email);
    res.send(response);
  } catch (error: any) {
    if (error.message == "You need to be login")
      res.status(401).send({ error: error.message });
    else if (error.message == "Not found this task")
      res.status(402).send({ error: error.message });
    else if (error.message == "User not created this task")
      res.status(402).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
});
app.get("/tasks", authMiddleware, async (req: any, res) => {
  try {
    const response = await getTasks();

    res.send(response);
  } catch (error: any) {
    if (error.message) res.status(404).send({ error: error.message });
    else if (!req.user) res.status(401).send({ error: "Unauthorized" });
    else res.status(500).send({ error: error.message });
  }
});
app.get("/task/:id", authMiddleware, async (req: any, res) => {
  console.log(req.user);
  try {
    const { id } = req.params;
    const response = await getTaskId(id);

    res.send(response);
  } catch (error: any) {
    if (error.message == "There isn't task")
      res.status(404).send({ error: error.message });
    else if (!req.user) res.status(401).send({ error: "Unauthorized" });
    else res.status(500).send({ error: error.message });
  }
});
app.delete("/delete-task/:id", authMiddleware, async (req: any, res) => {
  console.log(req.user);
  try {
    const { id } = req.params;
    const response = await deleteTask(id);

    res.send(response.message);
  } catch (error: any) {
    if (error.message == "There isn't task")
      res.status(404).send({ error: error.message });
    else if (!req.user) res.status(401).send({ error: "Unauthorized" });
    else res.status(500).send({ error: error.message });
  }
});
app.delete("/delete-tasks/", authMiddleware, async (req: any, res) => {
  console.log(req.user);
  try {
    const ids = req.body;
    const response = await deleteManyTasks(ids);

    res.send(response);
  } catch (error: any) {
    if (error.message == "There isn't task")
      res.status(404).send({ error: error.message });
    else if (!req.user) res.status(401).send({ error: "Unauthorized" });
    else res.status(500).send({ error: error.message });
  }
});
app.patch("/task-done/:id", authMiddleware, async (req: any, res) => {
  console.log(req.user);
  try {
    const { done } = req.body;
    const { id } = req.params;
    const response = await completeTask(id, done);

    res.send(response);
  } catch (error: any) {
    if (error.message == "Task not found")
      res.status(404).send({ error: error.message });
    else if (!req.user) res.status(401).send({ error: "Unauthorized" });
    else res.status(500).send({ error: error.message });
  }
});
app.get("/notifications", authMiddleware, async (req, res) => {
  try {
    const response = await getNotifications();
    res.send(response);
  } catch (error: any) {
    if (error.message == "Notificatios not found")
      res.status(404).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
});

/// USERS CLIENT

app.get("/users", authMiddleware, async (req, res) => {
  try {
    const response = await getUsers();
    res.send(response);
  } catch (error: any) {
    if (error.message == "Users not found")
      res.status(404).send({ error: error.message });
    else res.status(500).send({ error: error.message });
  }
});

app.listen(port, () =>
  console.log("service connected http://localhost:" + port)
);
// sequelize.sync({ alter: true });
