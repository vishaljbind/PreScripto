import React, { useState, useContext } from "react";
import { assets } from "../../assets/assets";
import { AdminContext, AppContext } from "../../context/";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState(1);
  const [fees, setFees] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [about, setAbout] = useState("");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { aToken } = useContext(AdminContext);
  const { backEndUrl } = useContext(AppContext);
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!docImg) {
      return toast.error("Please upload doctor image");
    }
    const formData = new FormData();
    formData.append("image", docImg);
    formData.append("email", email);
    formData.append("name", name);
    formData.append("password", password);
    formData.append("experience", experience);
    formData.append("fees", Number(fees));
    formData.append("speciality", speciality);
    formData.append("about", about);
    formData.append("degree", degree);
    formData.append(
      "address",
      JSON.stringify({ line1: address1, line2: address2 })
    );
    /* // console form data
    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    } */

    try {
      const { data } = await axios.post(
        `${backEndUrl}/api/admin/add-doctor`,
        formData,
        {
          // aToken will be converted to smaller case
          // backend->middleware-> authAdmin will be called
          headers: { aToken },
        }
      );

      if (data.success) {
        toast.success(data.message);
        // reset form
        setDocImg(null);
        setEmail("");
        setName("");
        setPassword("");
        setExperience(1);
        setFees("");
        setSpeciality("General physician");
        setAbout("");
        setDegree("");
        setAddress1("");
        setAddress2("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      if (error.response) {
        if (error.response.data) {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <form className="m-5 w-full" onSubmit={onSubmitHandler}>
      <p className="mb-3 text-lg font-medium">Add Doctor</p>

      <div className="bg-white p-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc_img">
            <img
              className="w-16 bg-gray-100 border-r cursor-pointer rounded-full"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="uploaded image"
            />
          </label>
          <input
            type="file"
            id="doc_img"
            hidden
            onChange={(e) => setDocImg(e.target.files[0])}
          />
          <p>
            Upload doctor
            <br />
            picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          {/* left column */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col flex-1 gap-1">
              <p>Doctor Name</p>
              <input
                className="border rounded  px-3 py-2"
                type="text"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <p>Doctor Email</p>
              <input
                className="border rounded  px-3 py-2"
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <p>Doctor Password</p>
              <input
                className="border rounded  px-3 py-2"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <p>Doctor Experience</p>
              <select
                className="border rounded  px-3 py-2"
                name="experience"
                id="experience"
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                required
              >
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
                <option value="4">4 Years</option>
                <option value="5">5 Years</option>
                <option value="6">6 Years</option>
                <option value="7">7 Years</option>
                <option value="8">8 Years</option>
                <option value="9">9 Years</option>
                <option value="10">10 Years</option>
              </select>
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <p>Fees</p>
              <input
                className="border rounded  px-3 py-2"
                type="number"
                placeholder="Doctor fees"
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                required
              />
            </div>
          </div>

          {/* Right column */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col flex-1 gap-1">
              <p>Speciality</p>
              <select
                className="border rounded  px-3 py-2"
                name="speciality"
                id="speciality"
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <p>Education</p>
              <input
                className="border rounded  px-3 py-2"
                type="text"
                placeholder="Education"
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                required
              />
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <p>Address</p>
              <input
                className="border rounded  px-3 py-2"
                type="text"
                placeholder="Address 1"
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                required
              />
              <input
                className="border rounded  px-3 py-2"
                type="text"
                placeholder="Address 2"
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                required
              />
            </div>
          </div>
        </div>

        <div>
          <p className="mt-4 mb-2">About Doctor</p>
          <textarea
            className="w-full px-4 pt-2 border rounded"
            rows={5}
            placeholder="write about doctor"
            onChange={(e) => setAbout(e.target.value)}
            value={about}
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white text-sm px-10 py-3 rounded-full"
        >
          Add doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
