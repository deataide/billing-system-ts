import {
  changePasswordController,
  createUserController,
  deleteUserByIdController,
  getUserByIdController,
  getUserController,
  loginController,
  redefinePasswordController,
} from "../controllers/userController";

import express from "express";
import { verifyToken } from "./middlewares";
import { createCustomerController, deleteCustomerByIdController, listAllCustomersController } from "../controllers/stripeCustomerController";
import { createProductController, listAllProductsController, deleteProductByIdController } from "../controllers/stripeProductController";
import { createSubscriptionController } from "../controllers/stripeSubscriptionController";


const router = express.Router();

router.post("/signup", createUserController);
router.post("/signin", loginController);
router.post("/forget-password", changePasswordController);
router.post("/redefine-password/:token", redefinePasswordController);

// AUTHENTICATE ROUTES
router.get("/users", getUserController);
router.delete("/delete/:id", verifyToken, deleteUserByIdController)
router.get("/user/:id", verifyToken, getUserByIdController)

router.get("/customers/:userId", verifyToken, listAllCustomersController)
router.post("/create-customer", verifyToken, createCustomerController)
router.delete("/delete-customer/:userId/:customerId", verifyToken, deleteCustomerByIdController)

router.get("/products/:userId", listAllProductsController)
router.post("/create-product", createProductController)
router.delete("/delete-product/:userId/:customerId", verifyToken, deleteProductByIdController)

router.post("/create-subscription", createSubscriptionController)


export default router;
