import { useState, useEffect } from "react";
import { LuDownload } from "react-icons/lu";
import { BiLink } from "react-icons/bi";
import { IoMdSend } from "react-icons/io";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { ImSad } from "react-icons/im";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { client, urlFor } from "../client";
import MasonaryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";
import ThreeDotsLoading from "./ThreeDotsLoading";

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const { pinId } = useParams();

  const fetchPinDetail = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);

        if (data[0]) {
          const morePinQuery = pinDetailMorePinQuery(data[0]);

          client.fetch(morePinQuery).then((res) => setPins(res));
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetail();
  }, [pinId]);

  if (!pinDetail) return <Spinner message="Loading..." />;

  const changeCommentHandler = (e) => {
    setComment(e.target.value);
  };

  const addComment = () => {
    if (comment) {
      setAddingComment(true);
      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetail();
          setComment("");
          setAddingComment(false);
        });
    }
  };

  const clickMoreHandler = () => {
    setShowMore(true);
  };

  return (
    <>
      <div
        className="flex xl:flex-row xl:gap-5 flex-col m-auto"
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        <div>
          <div className="border-2 bg-white  p-5 rounded-md shadow-xl">
            <div className="flex justify-center items-center md:items-start flex-initial">
              <img
                src={pinDetail?.image && urlFor(pinDetail.image)}
                alt="pin"
                className="rounded-xl w-[360px] transition ease-in-out delay-75 hover:scale-105"
              />
            </div>

            <div className="flex items-center justify-between pt-5">
              <div className="flex gap-2 items-center transition ease-in-out delay-75 hover:scale-110">
                <a
                  href={`${pinDetail.image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#AE88D1] w-28 h-8 rounded-full flex items-center justify-center gap-1 text-white text-lg opacity-70 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <LuDownload />
                  <p className="text-sm font-semibold">Download</p>
                </a>
              </div>

              {pinDetail.destination && (
                <div className="flex gap-2 items-center transition ease-in-out delay-75 hover:scale-110">
                  <a
                    href={pinDetail.destination}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className=" bg-slate-500 w-28 h-8 rounded-full flex items-center justify-center gap-1 text-white text-lg opacity-70 hover:opacity-100 hover:shadow-md outline-none"
                  >
                    <BiLink />
                    <p className="text-sm font-semibold">Link</p>
                  </a>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl text-[#8667A1] font-bold break-words text-center mt-3 mb-3">
                {pinDetail.title}
              </h1>
              <p className="text-center">{pinDetail.about}</p>
            </div>
          </div>

          <div className="flex items-center justify-end mt-3 gap-2">
            <p className="font-mono italic text-[#8667A1]">posted by</p>
            <Link
              to={`user-profile/${pinDetail.postedBy?._id}`}
              className="flex gap-2 items-center  rounded-lg"
            >
              <img
                className="w-5 h-5 rounded-full object-cover"
                src={pinDetail.postedBy?.image}
                alt="userProfile"
              />
              <p className="capitalize text-sm text-gray-500">
                {pinDetail.postedBy?.userName}
              </p>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="max-h-370 overflow-y-auto xl:w-880">
            {pinDetail?.comments?.map((comment, i) => (
              <div
                className="flex gap-2 mt-5 items-center p-2 bg-white rounded-lg"
                key={i}
              >
                <img
                  src={comment.postedBy.image}
                  alt="user-profile"
                  className="w-8 h-8 rounded-full cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{comment.postedBy.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center mt-6 gap-3">
            <Link to={`user-profile/${user?._id}`}>
              <img
                className="w-10 h-10 rounded-full cursor-pointer"
                src={user.image}
                alt="userProfile"
              />
            </Link>
            <div className="relative w-4/5 flex justify-end items-center">
              <input
                type="text"
                className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                placeholder="Add a comment here"
                value={comment}
                onChange={changeCommentHandler}
              />
              {addingComment ? (
                <ThreeDotsLoading />
              ) : (
                <button
                  type="button"
                  className="absolute pr-1"
                  onClick={addComment}
                >
                  <IoMdSend size={24} style={{ color: "#AE88D1" }} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <h2 className="text-center font-bold text-2xl mt-8 mb-4">
        More like this
      </h2>
      {!showMore && (
        <div className="animate-bounce m-6" onClick={clickMoreHandler}>
          <MdKeyboardDoubleArrowDown
            size={48}
            className="m-auto text-[#8667A1] cursor-pointer"
          />
        </div>
      )}
      {showMore && pins?.length > 0 && <MasonaryLayout pins={pins} />}
      {showMore && pins?.length === 0 && (
        <div className="flex justify-center items-center gap-2">
          <ImSad />
          <p>Sorry, there is no similar pin like this!</p>
        </div>
      )}
    </>
  );
};

export default PinDetail;
