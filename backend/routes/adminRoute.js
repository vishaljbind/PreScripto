import express from "express";
import {
  addDoctor,
  loginAdmin,
  getAllDoctors,
  getAllAppointments,
  cancelAppointment,
  adminDashboard,
} from "../controllers/adminController.js";
import { authAdmin, upload } from "../middlewares/index.js";
import { changeAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/all-doctors", authAdmin, getAllDoctors);
adminRouter.patch("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/all-appointments", authAdmin, getAllAppointments);
adminRouter.post("/cancel-appointment", authAdmin, cancelAppointment);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

export default adminRouter;
