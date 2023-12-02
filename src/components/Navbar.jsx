import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFocus = () => navigate("/search");
  if (!user) return null;
  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5 mb-3">
      <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm ">
        <IoMdSearch fontSize={21} className="ml-1" />
        <input
          type="text"
          onChange={handleSearch}
          placeholder="Search"
          value={searchTerm}
          onFocus={handleFocus}
          className="p-2 w-full bg-white outline-none"
        />
      </div>
      <div className="flex justify-center items-center gap-3">
        <Link to={`user-profile/${user?._id}`} className="hidden md:block">
          <img
            src={user?.image}
            alt="userImage"
            className="w-10 h-10 rounded-lg"
          />
        </Link>
        <Link
          to="create-pin"
          className="bg-black text-white rounded-full w-8 h-8 flex justify-center items-center"
        >
          <IoMdAdd />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
