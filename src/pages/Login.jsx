import LoginInput from "@/components/LoginInput";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <section className="h-screen flex flex-col items-center justify-center md:flex-row md:gap-16">
      <div className="text-center md:text-left md:w-1/3">
        <h1>LOGO + TITLE + DESCRIPTION</h1>
        <h1>LOGO + TITLE + DESCRIPTION</h1>
        <h1>LOGO + TITLE + DESCRIPTION</h1>
      </div>
      <div className="w-full md:w-1/3 px-4">
        <div className="bg-white max-w-full md:max-w-[500px] mx-auto p-6 border rounded-xl shadow-md">
          <h1 className="text-center mb-1 text-[22px]">Welcome to BenchMark</h1>
          <p className="text-center text-[14px] mb-4">Sign in your account</p>
          <form>
            <LoginInput placeholder="Enter your Email" />
            <LoginInput
              placeholder="Enter your Password"
              type={showPassword ? "text" : "password"}
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
            <button className="w-full bg-green-500 py-2 rounded-xl text-white font-semibold transition-all duration-300 hover:bg-green-800">
              Login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
