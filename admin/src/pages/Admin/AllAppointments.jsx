import React, { useContext, useEffect } from "react";
import { AdminContext, AppContext } from "../../context";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const {
    aToken,
    getAllAppointments,
    appointments,
    setAppointments,
    cancelAppointment,
  } = useContext(AdminContext);

  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white rounded border text-sm min-h-[60vh] max-h-[80vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {appointments.map((appointment, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            key={appointment._id}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full bg-gray-200"
                src={appointment.userData.image}
                alt={appointment.userData.name}
              />
              <p>{appointment.userData.name}</p>
            </div>
            <p className="max-sm:hidden">
              {calculateAge(appointment.userData.dob)}
            </p>
            <p>
              {slotDateFormat(appointment.slotDate)}, {appointment.slotTime}
            </p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full bg-gray-200"
                src={appointment.docData.image}
                alt={appointment.docData.name}
              />
              <p>{appointment.docData.name}</p>
            </div>
            <p>
              {currency} {appointment.amount}
            </p>
            <>
              {appointment.isCancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : appointment.isCompleted ? (
                <p className="text-green-400 text-xs font-medium">Completed</p>
              ) : (
                <p>
                  <img
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt="cancel"
                    onClick={() => cancelAppointment(appointment._id)}
                  />
                </p>
              )}
            </>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;
