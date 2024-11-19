import { createContext, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext";

// Context for Doctor login and token
const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  // const backEndUrl = import.meta.env.VITE_BACKEND_URL;
  const { backEndUrl } = useContext(AppContext);
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profile, setProfile] = useState(false);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backEndUrl}/api/doctor/appointments`,
        {
          headers: { dToken },
        }
      );
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backEndUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backEndUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/doctor/dashboard`, {
        headers: { dToken },
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getProfile = async () => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/doctor/profile`, {
        headers: { dToken },
      });
      if (data.success) {
        setProfile(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    dToken,
    setDToken,
    getAppointments,
    appointments,
    completeAppointment,
    cancelAppointment,
    getDashboardData,
    dashData,
    getProfile,
    profile,
    setProfile,
  };

  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

export { DoctorContextProvider, DoctorContext };
