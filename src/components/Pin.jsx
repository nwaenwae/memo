import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuid4 } from "uuid";
import { LuDownload } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { BiLink } from "react-icons/bi";

import { client, urlFor } from "../client";
import { fetchUser } from "../utils/fetchUser";
import ThreeDotsLoading from "./ThreeDotsLoading";

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  const [postHover, setPostHover] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const userInfo = fetchUser();

  const alreadySaved = !!save?.filter(
    (item) => item.postedBy?._id === userInfo?.sub
  )?.length;

  const mouseEnterHandler = () => {
    setPostHover(true);
  };

  const mouseLeaveHandler = () => {
    setPostHover(false);
  };

  const clickImageHandler = () => {
    navigate(`/pin-detail/${_id}`);
  };

  const clickSaveButtonHandler = (e) => {
    e.stopPropagation();
    savePin(_id);
  };

  const clickDeleteButtonHandler = (e) => {
    e.stopPropagation();
    deletePin(_id);
  };

  const savePin = (id) => {
    setIsLoading(true);
    if (!alreadySaved) {
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuid4(),
            userId: userInfo?.sub,
            postedBy: {
              _type: "postedBy",
              _ref: userInfo?.sub,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
          setIsLoading(false);
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="my-3 mx-1 p-2 shadow-2xl bg-gray-50 rounded-md transition ease-in-out delay-150 hover:scale-105">
      <div
        onMouseEnter={mouseEnterHandler}
        onMouseLeave={mouseLeaveHandler}
        onClick={clickImageHandler}
        className="relative cursor-zoom-in w-auto hover:shadow-2xl rounded-lg overflow-hidden"
      >
        {isLoading && (
          <div className="relative justify-center">
            <img
              alt="user-post"
              src={urlFor(image).width(250).url()}
              className="rounded-lg w-full pointer-events-none opacity-5"
            />
            <ThreeDotsLoading />
          </div>
        )}
        {!isLoading && (
          <img
            alt="user-post"
            src={urlFor(image).width(250).url()}
            className="rounded-lg w-full"
          />
        )}
        {postHover && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-10"
            style={{ height: "100%" }}
          >
            <div className="flex justify-end">
              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-[#8667A1] opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none"
                >
                  {save?.length} Saved
                </button>
              ) : (
                <button
                  onClick={clickSaveButtonHandler}
                  className="bg-[#8667A1]  opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none"
                >
                  Save
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-7 h-7 rounded-full flex items-center justify-center text-[#AE88D1] text-lg opacity-70 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <LuDownload />
                </a>
              </div>
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white w-7 h-7 flex items-center justify-center text-blue-600 text-lg font-bold rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                >
                  <BiLink />
                </a>
              )}

              {postedBy?._id === userInfo?.sub && (
                <button
                  type="button"
                  onClick={clickDeleteButtonHandler}
                  className="bg-white w-7 h-7 flex items-center justify-center opacity-70 hover:opacity-100 font-bold text-lg rounded-full hover:shadow-md outlined-none"
                >
                  <MdDelete style={{ color: "#C70436" }} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`user-profile/${postedBy?._id}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          className="w-5 h-5 rounded-full object-cover"
          src={postedBy?.image}
          alt="userProfile"
        />
        <p className="font-mono text-zinc-400 italic capitalize text-sm">
          {postedBy?.userName}
        </p>
      </Link>
    </div>
  );
};

export default Pin;
