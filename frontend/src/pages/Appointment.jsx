import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { RelatedDoctors } from "../components";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, currencySymbol, backEndUrl, getDoctorsData, token } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = async () => {
    const doc = doctors.find((doc) => doc._id === docId);
    setDocInfo(doc);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      // getting next 7 days
      let currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() + i);

      // setting end time of date
      let endTime = new Date();
      endTime.setDate(currentDate.getDate());
      endTime.setHours(21, 0, 0, 0);

      // set hours
      if (today.getDate() === currentDate.getDate()) {
        // if currentTime > 10 then set available hours 1 after it
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        // date is future date
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      // create slots
      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        let slotDate = day + "_" + month + "_" + year;
        let slotTime = formattedTime;

        const isSlotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        // show only avilable slots to users
        if (isSlotAvailable) {
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime,
          });
        }

        /*  timeSlots.push({
          dateTime: new Date(currentDate),
          time: formattedTime,
        }); */
        // increment time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }
    try {
      const date = docSlots[slotIndex][0].dateTime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        `${backEndUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        {
          headers: { uToken: token },
        }
      );
      if (data.success) {
        console.log("Appointment Booked");
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        console.log("slot not booked", data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo();
    }
  }, [docId, doctors]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  return (
    docInfo && (
      <div>
        {/* doctor's details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              src={docInfo?.image}
              className="w-full bg-primary sm:max-w-72 rounded-lg"
              alt={docInfo?.name}
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/* doctor : name, degree, experience */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo?.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo?.degree} - {docInfo?.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo?.experience}
              </button>
            </div>

            {/* Doctor's description */}
            <div>
              <p className="flex itemcenter gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo?.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol} {docInfo?.fees}
              </span>
            </p>
          </div>
        </div>

        {/* available slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4 ">
            {docSlots.length &&
              docSlots.map((slot, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  key={index}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "border border-r-gray-200"
                  }`}
                >
                  <p>{slot[0] && daysOfWeek[slot[0].dateTime.getDay()]}</p>
                  <p>{slot[0] && slot[0].dateTime.getDate()}</p>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-3 mt-4 w-full overflow-x-scroll">
            {/* available time */}
            {docSlots.length &&
              docSlots[slotIndex].map((slot, index) => (
                <p
                  onClick={() => setSlotTime(slot.time)}
                  key={index}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full
                           cursor-pointer 
                           ${
                             slot.time === slotTime
                               ? "bg-primary text-white"
                               : "text-gray-400 border border-gray-300"
                           }`}
                >
                  {slot.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button
            onClick={bookAppointment}
            className="bg-primary text-sm text-white font-light px-14 py-3 rounded-full my-6"
          >
            Book an appointment
          </button>
        </div>

        {/* Listing Related Doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
