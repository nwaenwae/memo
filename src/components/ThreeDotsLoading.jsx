import { ThreeDots } from "react-loader-spinner";
const loadingStyle = {
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const ThreeDotsLoading = () => {
  return (
    <div className="absolute" style={loadingStyle}>
      <ThreeDots
        height="40"
        width="40"
        radius="9"
        color="#8667A1"
        ariaLabel="three-dots-loading"
        visible={true}
      />
    </div>
  );
};

export default ThreeDotsLoading;
