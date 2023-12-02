import { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import { client } from "../client";
import banner from "../assets/banner.png";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const activeBtnStyles =
  "bg-[#AE88D1] text-white font-bold p-2 rounded-lg w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 text-[#8667A1] font-bold p-2 rounded-lg w-20 outline-none";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("created");

  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => setUser(data[0]));
  }, [userId]);

  useEffect(() => {
    if (text === "Created") {
      const createdPinQuery = userCreatedPinsQuery(userId);
      client.fetch(createdPinQuery).then((data) => setPins(data));
    } else {
      const savedPinQuery = userSavedPinsQuery(userId);
      client.fetch(savedPinQuery).then((data) => setPins(data));
    }
  }, [text, userId]);

  const clickLogoutHandler = () => {
    googleLogout();
    localStorage.clear();
    navigate("/login");
  };

  const clickCreatedHandler = (e) => {
    setText(e.target.textContent);
    setActiveBtn("created");
  };

  const clickSavedHandler = (e) => {
    setText(e.target.textContent);
    setActiveBtn("saved");
  };

  if (!user) {
    return <Spinner message="Loading profile..." />;
  }
  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5 ">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center ">
            <img
              src={banner}
              className="w-full h-370 2xl:h-510 shadow-lg object-cover bg-blackOverlay"
              alt="banner-img"
            />
            <img
              src={user.image}
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              alt="user-profile"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {userId === user._id && (
                <button
                  type="button"
                  className="bg-white p-2 rounded-full cursor-pointer hover:scale-110"
                  onClick={clickLogoutHandler}
                >
                  <AiOutlineLogout size={32} />
                </button>
              )}
            </div>
          </div>
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={clickCreatedHandler}
              className={`${
                activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={clickSavedHandler}
              className={`${
                activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>
          {pins?.length ? (
            <div className="px-2">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
              No pin found!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
