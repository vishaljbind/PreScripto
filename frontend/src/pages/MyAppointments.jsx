import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointments = () => {
  // dummy data
  const { backEndUrl, token, getDoctorsData } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const navigate = useNavigate();

  const slotDateFormat = (date) => {
    const dateArray = date.split("_");
    return (
      dateArray[0] +
      " " +
      months[parseInt(dateArray[1]) - 1] +
      ", " +
      dateArray[2]
    );
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/user/appointments`, {
        headers: {
          uToken: token,
        },
      });

      if (data.success) {
        setAppointments(data.appointments);
      }
      console.log(appointments);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backEndUrl}/api/user/cancel-appointment`,
        { appointmentId },
        {
          headers: {
            uToken: token,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id, //order id received in response
      callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
      receipt: order.receipt,
      handler: async (response) => {
        // response received after payment
        console.log(response);
        try {
          const { data } = await axios.post(
            `${backEndUrl}/api/user/verify-payment`,
            response,
            {
              headers: {
                uToken: token,
              },
            }
          );
          if (data.success) {
            getUserAppointments();
            navigate("/appointments");
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  const paymentHandler = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backEndUrl}/api/user/payment`,
        { appointmentId },
        {
          headers: {
            uToken: token,
          },
        }
      );
      if (data.success) {
        console.log(data.order);
        // initPay(data.order);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getUserAppointments();
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My appointments
      </p>
      <div>
        {appointments &&
          appointments.slice(0, 4).map((appointment, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            >
              <div>
                <img
                  src={appointment.docData.image}
                  alt={appointment.docData.name}
                  className="w-32 bg-indigo-50"
                />
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">
                  {appointment.docData.name}
                </p>
                <p>{appointment.docData.speciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{appointment.docData.address.line1}</p>
                <p className="text-xs">{appointment.docData.address.line2}</p>
                <p className="text-sm mt-1">
                  <span className="text-sm text-neutral-700 font-medium">
                    Date & Time:{" "}
                  </span>{" "}
                  {slotDateFormat(appointment.slotDate)} |{" "}
                  {appointment.slotTime}
                </p>
              </div>
              <div>{/* empty div to make it 2 columns for mobile view */}</div>

              <div className="flex flex-col gap-2 justify-end">
                {!appointment.isCancelled &&
                  appointment.isPaymentDone &&
                  !appointment.isCompleted && (
                    <button className="sm:min-w-48 py-2 border bg-indigo-50 rounded text-stone-500">
                      Paid
                    </button>
                  )}
                {!appointment.isCancelled &&
                  !appointment.isPaymentDone &&
                  !appointment.isCompleted && (
                    <button
                      onClick={() => paymentHandler(appointment._id)}
                      className="text-sm text-stone-500 text-center 
                sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 "
                    >
                      Pay Online
                    </button>
                  )}
                {!appointment.isCancelled && !appointment.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(appointment._id)}
                    className="text-sm text-stone-500 text-center
                sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-300 "
                  >
                    Cancel Appointment
                  </button>
                )}
                {appointment.isCancelled && (
                  <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                    Appointment Cancelled
                  </button>
                )}
                {appointment.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                    Appointment Completed
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyAppointments;
