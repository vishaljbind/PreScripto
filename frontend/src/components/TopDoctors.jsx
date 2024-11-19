import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {doctors.slice(0, 10).map((doctor, index) => (
          <div
            key={index}
            onClick={() => navigate(`/appointment/${doctor._id}`)}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
          >
            <img src={doctor.image} alt={doctor.name} className="bg-blue-50" />
            <div className="p-4">
              <div
                className={`flex items-center gap-2 text-sm text-center ${
                  doctor.available ? "bg-green-500" : "bg-gray-500"
                }}`}
              >
                <p
                  className={`${
                    doctor.available ? "bg-green-500" : "bg-gray-500"
                  } rounded-full w-2 h-2`}
                ></p>
                <p>{doctor.available ? "Available" : "Not Available"}</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{doctor.name}</p>
              <p className="text-gray-600 text-sm">{doctor.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10"
      >
        more...
      </button>
    </div>
  );
};

export default TopDoctors;
