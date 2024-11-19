import React, { useContext, useEffect } from "react";
import { AdminContext, AppContext } from "../../context/";
import { assets } from "../../assets/assets";

const Dashboard = () => {
  const {
    aToken,
    getDashboardData,
    dashData,
    cancelAppointment,
    appointments,
  } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashboardData();
    }
  }, [aToken, appointments]);

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.doctor_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.doctors}
              </p>
              <p className="text-gray-400">Doctors</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.appointment_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-gray-400">Patients</p>
            </div>
          </div>
        </div>

        <div className="bg-white ">
          <div className="flex items-center gap-2.5  p-4 mt-10 rounded-t border">
            <img src={assets.list_icon} alt="Latest Bookings" />
            <p className="font-semibold">Latest Bookings</p>
          </div>
          <div className="pt-4 border border-t-0">
            {dashData.latestAppointments.map((appointment) => (
              <div
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                key={appointment._id}
              >
                <img
                  className="rounded-full w-10"
                  src={appointment.docData.image}
                  alt={appointment.docData.name}
                />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {appointment.docData.name}
                  </p>
                  <p className="text-gray-600">
                    {slotDateFormat(appointment.slotDate)}
                  </p>
                </div>
                <>
                  {appointment.isCancelled ? (
                    <p className="text-red-400 text-xs font-medium">
                      Cancelled
                    </p>
                  ) : appointment.isCompleted ? (
                    <p className="text-green-400 text-xs font-medium">
                      Completed
                    </p>
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
      </div>
    )
  );
};

export default Dashboard;
