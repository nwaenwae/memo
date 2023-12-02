import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { FiAlertTriangle } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { client } from "../client";
import Spinner from "./Spinner";
import { categories } from "../utils/data";

const CreatePin = ({ user }) => {
  const [saving, setSaving] = useState(false);

  const [loading, setLoading] = useState(false);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const uploadImageHandler = (e) => {
    const { type, name } = e.target.files[0];

    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/jpeg" ||
      type === "image/gif" ||
      type === "image/tiff"
    ) {
      setWrongImageType(false);
      setLoading(true);
      client.assets
        .upload("image", e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((e) => {
          console.log("Image upload error", e);
        });
    } else {
      setWrongImageType(true);
    }
  };

  const deleteImageHandler = () => {
    setImageAsset(null);
  };

  const onSubmit = (data) => {
    setSaving(true);
    if (data) {
      const doc = {
        _type: "pin",
        title: data.title,
        about: data.about,
        destination: data.destination,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
        category: data.category,
      };
      client.create(doc).then(() => navigate("/"));
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full shadow-xl">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinner />}
            {wrongImageType && <p>Wrong image type</p>}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to Upload</p>
                  </div>
                  <p className="mt-32 text-gray-400 text-center">
                    Use high-quality JPG, SVG, PNG, GIF, TIFF less than 20MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImageHandler}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploadedPic"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl opacity-70 hover:opacity-100 cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={deleteImageHandler}
                >
                  <MdDelete style={{ color: "#C70436" }} />
                </button>
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
            <div>
              <input
                type="text"
                name="title"
                {...register("title", { required: true })}
                placeholder="Add your title here"
                className="outline-none text-2xl sm:text-3xl font-bold text-[#8667A1] border-b-2 border-gray-200 p-2"
              />
              {errors.title && errors.title.type === "required" && (
                <div className="flex items-center gap-1 text-[#C70436] text-sm">
                  <FiAlertTriangle />
                  Title is required.
                </div>
              )}
            </div>

            <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
              <p className="font-mono italic text-[#AE88D1]">
                Your Pin, Your Creation
              </p>
              <FaRegHeart className="text-[#AE88D1] rotate-12" />
            </div>

            <div>
              <input
                type="text"
                name="about"
                {...register("about", { required: true })}
                placeholder="Add your pin description"
                className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2 w-full"
              />
              {errors.about && errors.about.type === "required" && (
                <div className="flex items-center gap-1 text-[#C70436] text-sm">
                  <FiAlertTriangle />
                  Description is required.
                </div>
              )}
            </div>
            <div>
              <input
                type="text"
                name="destination"
                {...register("destination", { required: true })}
                placeholder="Add your destination link"
                className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2 w-full"
              />
              {errors.destination && errors.destination.type === "required" && (
                <div className="flex items-center gap-1 text-[#C70436] text-sm">
                  <FiAlertTriangle />
                  Destination is required.
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div>
                <p className="mb-2 text-[#8667A1] font-semibold text-lg sm:text-xl">
                  Choose Pin Category
                </p>
                <select
                  className="outline-none w-4/5 border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
                  name="category"
                  {...register("category", { required: true })}
                >
                  <option className="bg-white" value="">
                    Select Category
                  </option>
                  {categories.map((category) => (
                    <option
                      className="text-base border-0 outline-none capitalize bg-white text-black"
                      value={category.name}
                      key={category.name}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && errors.category.type === "required" && (
                  <div className="flex items-center gap-1 text-[#C70436] text-sm">
                    <FiAlertTriangle />
                    Category is required.
                  </div>
                )}
              </div>
              <div className="flex justify-end items-end mt-5">
                <button
                  type="submit"
                  className={`bg-[#AE88D1] text-white ${
                    saving ? "opacity-50 pointer-events-none" : "opacity-100"
                  } font-bold p-2 rounded-full w-28 outline-none transition ease-in-out delay-75 hover:scale-110`}
                >
                  {saving ? "Saving..." : "Save Pin"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePin;
