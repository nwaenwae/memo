import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FcGoogle } from "react-icons/fc";
import banner from "../assets/banner.png";
import logo from "../assets/logo.png";
import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();
  const responseGoogle = (response) => {
    const userObj = jwtDecode(response.credential);
    localStorage.setItem("user", JSON.stringify(userObj));

    const { name, sub, picture } = userObj;

    const doc = {
      _id: sub,
      _type: "user",
      userName: name,
      image: picture,
    };

    client.createIfNotExists(doc).then(() => {
      navigate("/", { replace: true });
    });
  };
  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <img
          src={banner}
          className="w-full h-full object-cover opacity-30"
          alt="banner"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="border-2 rounded-md">
            <div className="p-5 flex justify-center">
              <img src={logo} width="150px" alt="logo" />
            </div>
            <div className="shadow-2xl pb-1">
              <GoogleOAuthProvider
                clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
              >
                <GoogleLogin
                  render={(renderProps) => (
                    <button
                      type="button"
                      className=""
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <FcGoogle className="" /> Sign in with google
                    </button>
                  )}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy="single_host_origin"
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
