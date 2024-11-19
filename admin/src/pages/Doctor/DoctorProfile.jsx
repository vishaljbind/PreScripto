import React, { useContext, useEffect, useState } from "react";
import { DoctorContext, AppContext } from "../../context/";
import { toast } from "react-toastify";
import axios from "axios";

const DoctorProfile = () => {
  const { dToken, profile, getProfile, setProfile } = useContext(DoctorContext);
  const { currency, backEndUrl } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (dToken) {
      getProfile();
    }
  }, [dToken]);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profile.address,
        fees: profile.fees,
        available: profile.available,
        password: profile.password || "",
      };
      const { data } = await axios.post(
        `${backEndUrl}/api/doctor/update-profile`,
        updateData,
        {
          headers: { dToken },
        }
      );
      if (data.success) {
        toast.success(data.message);

        getProfile();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsEdit(false);
    }
  };

  return (
    profile && (
      <div>
        <div className="flex flex-col gap-4 m-5">
          <div>
            <img
              className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
              src={profile.image}
              alt={profile.name}
            />
          </div>
          <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
            {/* Doc info: name, degree, experience */}
            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
              {profile.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <p>
                {profile.degree} - {profile.speciality}
                <button className="py-0.5 px-2 border text-sm rounded-full">
                  {profile.experience} years
                </button>
              </p>
            </div>

            {/*  Doc About */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
                About:
              </p>
              <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                {profile.about}
              </p>
            </div>

            <p className="text-gray-600 font-medium mt-4">
              Appointment fee :{" "}
              <span className="text-gray-800">
                {currency}{" "}
                {isEdit ? (
                  <input
                    type="number"
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, fees: e.target.value }))
                    }
                    value={profile.fees}
                  ></input>
                ) : (
                  profile.fees
                )}
              </span>
            </p>

            <div className="flex gap-2 py-2">
              <p>Address:</p>
              <p className="text-sm">
                {isEdit ? (
                  <input
                    type="text"
                    value={profile.address.line1}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                  />
                ) : (
                  profile.address.line1
                )}

                <br />
                {isEdit ? (
                  <input
                    type="text"
                    value={profile.address.line2}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                  />
                ) : (
                  profile.address.line2
                )}
              </p>
            </div>

            <div className="flex gap-1 pt-2">
              <input
                type="checkbox"
                id="available"
                onChange={() =>
                  isEdit &&
                  setProfile((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
                checked={profile.available}
              />
              <label htmlFor="available"> Available</label>
            </div>

            {isEdit ? (
              <button
                className="px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all"
                onClick={updateProfile}
              >
                Save
              </button>
            ) : (
              <button
                className="px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all"
                onClick={() => setIsEdit(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
