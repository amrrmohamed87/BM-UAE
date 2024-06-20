import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginInput from "@/components/LoginInput";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/logoIcon.png";
import { useNavigate } from "react-router-dom";
export function Login() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function handleUserChange(event) {
    const { name, value } = event.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLogin(true);
    try {
      const response = await fetch(
        "https://benchmark-innovation.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const resData = await response.json();
      console.log(resData);

      if (!response.ok) {
        toast.error(resData.message);
        setIsLogin(false);
        return;
      }

      setUserData({
        email: "",
        password: "",
      });
      setIsLogin(false);

      const token = resData.token;
      localStorage.setItem("token", token);

      const name = resData.user.name;
      localStorage.setItem("name", name);

      return navigate("/");
    } catch (error) {
      toast.error(resData.message);
      setIsLogin(false);
      return;
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="h-screen flex flex-col items-center justify-center md:flex-row md:gap-16">
        <div className="text-center md:text-left md:w-1/3">
          <div className="flex flex-col items-center">
            <img src={logo} className="w-[200px] md:w-full mb-1" />
            <p className="text-gray-800 mb-4 md:mb-0 px-8">
              Reach the top with{" "}
              <span className="text-blue-900 font-semibold">BenchMark</span>{" "}
              <span className="text-[#81cf09] font-semibold">Innovation</span>{" "}
              in smart way
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/3 px-4">
          <div className="bg-white max-w-full md:max-w-[500px] mx-auto p-6 border rounded-xl shadow-md">
            <h1 className="text-center mb-1 text-[22px]">
              Welcome to BenchMark
            </h1>
            <p className="text-center text-[14px] mb-4">Sign in your account</p>
            <form>
              <LoginInput
                type="email"
                name="email"
                id="email"
                value={userData.email}
                onChange={handleUserChange}
                placeholder="Enter your Email"
              />
              <LoginInput
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={userData.password}
                onChange={handleUserChange}
                placeholder="Enter your Password"
                icon={
                  showPassword ? (
                    <EyeOff
                      size={22}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  ) : (
                    <Eye
                      size={22}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  )
                }
              />
              <button
                disabled={isLogin}
                onClick={handleLogin}
                className="w-full bg-green-500 py-2 rounded-xl text-white font-semibold transition-all duration-300 hover:bg-green-800"
              >
                {isLogin ? "Loading..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
