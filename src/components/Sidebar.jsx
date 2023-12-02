import { NavLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import logo from "../assets/logo.png";
import { categories } from "../utils/data";

const isInactiveStyle =
  "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";

const isActiveStyle =
  "flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize";

const Sidebar = ({ user, closeToggle }) => {
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };
  return (
    <div className="flex flex-col justify-between h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link
          to="/"
          className="flex px-5 my-6 pt-1 w-190 items-center"
          onClick={handleCloseSidebar}
        >
          <h2 className="font-mono text-4xl pt-10 text-[#8667A1]">memo</h2>
          <img src={logo} alt="logo" className="w-12" />
        </Link>
        <div className="flex flex-col gap-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isInactiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <RiHomeFill />
            Home
          </NavLink>
          <h3 className="mt-2 px-5 2xl:text-xl text-[#AE88D1]">
            Discover Categories
          </h3>
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isInactiveStyle
              }
              onClick={handleCloseSidebar}
              key={category.name}
            >
              <img
                src={category.image}
                className="w-8 h-8 rounded-full shadow-sm"
                alt="category"
              />
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      {user && (
        <Link
          to={`user-profile/${user._id}`}
          className="flex my-5 mb-3 gap-2 p-3 items-center bg-white rounded-lg shadow-lg mx-3"
          onClick={handleCloseSidebar}
        >
          <img src={user.image} className="w-10 h-10 rounded-full" alt="user" />
          <p className="text-[#AE88D1] font-mono">{user.userName}</p>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
