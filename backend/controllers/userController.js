// handling user requests
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModels.js";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import {
  initializePayment,
  verifyPaymentAuthenticity,
} from "../config/paytm/managePayment.js";

const saltRounds = 10;

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking all fields
    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // validating email
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // validating strong password
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a strong password" });
    }

    // check if email already exists
    const user = await userModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // hashing strong password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new userModel(userData);
    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    if (token) {
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Something went wrong" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// API to login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (isMatchPassword) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");
    if (userData) {
      return res.json({ success: true, userData });
    } else {
      return res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// API to update user profile data
const updateUserProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, gender, dob } = req.body;
    const imageFile = req.file;
    if (!name || !phone || !address || !dob) {
      return res.json({ success: false, message: "Missing fields" });
    }
    const user = await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      gender,
      dob,
    });
    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }
    return res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// API to book appoinement
const bookAppoinment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select(["-password"]);

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }
    // check if slot is available
    const slotsBooked = docData.slots_booked;
    if (slotsBooked[slotDate]) {
      if (slotsBooked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot already booked" });
      } else {
        slotsBooked[slotDate].push(slotTime);
      }
    } else {
      // no slots booked for that date
      slotsBooked[slotDate] = [];
      slotsBooked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select(["-password"]);
    // do not save doctor's appointment history
    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData,
      amount: docData.fees,
      bookingDate: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // save new slots data in doctor data
    await doctorModel.findByIdAndUpdate(docId, {
      slots_booked: slotsBooked,
    });

    return res.json({
      success: true,
      message: "Appoinment booked successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// API to get user appointments
const getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.body;

    const appointments = await appointmentModel.find({ userId }).sort({
      slotDate: -1,
    });

    if (appointments) {
      return res.json({ success: true, appointments });
    } else {
      return res.json({ success: false, message: "No appointments found" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// API to cancel appoinment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    // verify appointment is done by the user

    if (appointmentData.userId.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized access" });
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCancelled: true,
    });

    // update slots booked in doctor data
    const { docId, slotDate, slotTime } = appointmentData;
    const docData = await doctorModel.findById(docId);
    const slots_booked = docData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (slot) => slot !== slotTime
    );
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    return res.json({
      success: true,
      message: "Appoinment cancelled successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// API to make payment of appointment using razorpay
/* const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
}); */

const paymentHandler = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData || appointmentData.isCancelled) {
      return res.json({
        success: false,
        message: "Appointment cancelled or not found!",
      });
    }

    // Creating options for razorpay
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };
    // create order
    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.error.description });
  }
};

// API to verify payment via razorpay
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    console.log(orderInfo);

    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        isPaymentDone: true,
      });
      return res.json({ success: true, message: "Payment Successful" });
    } else {
      return res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const paytmPaymentHandler = async (req, res) => {
  return res.json({ success: true, message: "TestPayment Successful" });

  try {
    const { appointmentId } = req.body;
    const orderId = `${appointmentId}_${new Date().getTime()}`;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.isCancelled) {
      return res.json({
        success: false,
        message: "Appointment cancelled or not found!",
      });
    }

    //create paytmParams for generating checksumhash and txnToken.
    let paytmParams = {};
    paytmParams.body = {
      requestType: "Payment",
      mid: process.env.PAYTM_MID,
      websiteName: process.env.PAYTM_WEBSITE_STAGING,
      orderId,
      callbackUrl: "http://localhost:4000/verify-payment",
      txnAmount: {
        value: appointmentData.amount,
        currency: process.env.CURRENCY,
      },
      userInfo: {
        custId: appointmentData.userData._id.toString(),
        email: appointmentData.userData.email,
        firstName: appointmentData.userData.name,
      },
    };

    let txnInfo = await initializePayment(paytmParams);

    txnInfo = JSON.parse(txnInfo);

    // check txnInfo
    //check of transaction token generated successfully
    if (txnInfo && txnInfo.body.resultInfo.resultStatus == "S") {
      //transaction initiation successful.
      //sending redirect to paytm page form with hidden inputs.
      const hiddenInput = {
        txnToken: txnInfo.body.txnToken,
        mid: process.env.PAYTM_MID,
        orderId,
      };
      res.render("intermediateForm.ejs", { hiddenInput });
    } else {
      //payment initialization failed.
      //send custom response
      //donot send this response. for debugging purpose only.
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const paytmVerifyPayment = async (req, res) => {
  try {
    //req.body contains all data sent by paytm related to payment.
    //check checksumhash to verify transaction is not tampared.
    const paymentObject = await verifyPaymentAuthenticity(req.body);
    if (paymentObject) {
      /* check for required status */
      if (paymentObject.body.resultInfo.resultStatus === "TXN_SUCCESS") {
        // payment success
      }
      res.send(
        '<h1 style="text-align: center;">Payment Successful.</h1><h3 style="text-align: center;">Process it in backend according to need.</h3><h3 style="text-align:center;"><a href="/" style="text-align: center;">click here</a> to go to home page.</h3>'
      );
    } else {
      res.send(
        '<h1 style="text-align: center;color: red;">Payment Tampered.</h1><h3 style="text-align: center;">CHECKSUMHASH not matched.</h3> <h3 style="text-align: center;><a href="/">click here</a> to go to home page.</h3>'
      );
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  bookAppoinment,
  getUserAppointments,
  cancelAppointment,
  paymentHandler,
  verifyPayment,
  paytmPaymentHandler,
  paytmVerifyPayment,
};
