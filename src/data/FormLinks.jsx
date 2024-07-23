import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export function FormLinks({
  name,
  setSelectedForm,
  onCLose,
  isOpen,
  children,
  isClosed,
  textOverflow,
}) {
  const handleClick = () => {
    setSelectedForm(name);
  };
  return (
    <NavLink
      to="#"
      onClick={handleClick}
      className={
        isOpen
          ? "bg-blue-900 p-1 rounded flex stroke-[0.75] hover:stroke-neutral-100 stroke-neutral-100 text-neutral-100 hover:text-neutral-100 place-items-center gap-3 hover:bg-blue-900 transition-color duration-300"
          : "bg-transarent p-1 rounded flex stroke-[0.75] hover:stroke-neutral-100 stroke-neutral-400 text-neutral-400 hover:text-neutral-100 place-items-center gap-3 hover:bg-blue-900 transition-color duration-300"
      }
    >
      {children}
      {textOverflow && (
        <div className="flex overflow-clip place-items-center justify-between w-full">
          <p className="text-inherit overflow-hidden whitespace-nowrap tracking-wide">
            {name}
          </p>
          <ChevronRight />
        </div>
      )}
    </NavLink>
  );
}

export default FormLinks;
