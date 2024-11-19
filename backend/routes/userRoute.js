import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  bookAppoinment,
  getUserAppointments,
  cancelAppointment,
  paymentHandler,
  paytmPaymentHandler,
  verifyPayment,
  paytmVerifyPayment,
} from "../controllers/userController.js";
import express from "express";
import { authUser, upload } from "../middlewares/index.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/profile", authUser, getUserProfile);
userRouter.post(
  "/profile",
  upload.single("image"),
  authUser,
  updateUserProfile
);

userRouter.post("/book-appointment", authUser, bookAppoinment);
userRouter.get("/appointments", authUser, getUserAppointments);

userRouter.post("/cancel-appointment", authUser, cancelAppointment);
// userRouter.post("/payment", authUser, paymentHandler);
// userRouter.post("/verify-payment", authUser, verifyPayment);
userRouter.post("/payment", authUser, paytmPaymentHandler);

userRouter.post("/verify-payment", authUser, paytmVerifyPayment);

export default userRouter;
