import React from "react";

function LoginInput({ id, label, icon, showPassword, ...props }) {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={id} className="text-right mb-1 md:mb-2 text-[20px]">
        {label}
      </label>
      <div className="relative flex justify-center items-center">
        <input
          id={id}
          required
          {...props}
          className="w-full rounded-lg h-[30px] md:h-[35px] lg:h-[40px] border-2 border-gray-400 focus:outline-none focus:border-green-500 pl-2 md:pl-3 pr-4"
        />
        {icon && (
          <div
            onClick={showPassword}
            className="absolute inset-y-0 right-0 pr-2 md:pr-3 flex items-center cursor-pointer"
          >
            <div className="text-sm md:text-base">{icon}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginInput;
