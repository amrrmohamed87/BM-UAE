import { NavLink } from "react-router-dom";

export function NavigationLinks({ link, name, isOpen, children }) {
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        isActive
          ? "bg-blue-900 p-1 rounded flex stroke-[0.75] hover:stroke-neutral-100 stroke-neutral-100 text-neutral-100 hover:text-neutral-100 place-items-center gap-3 hover:bg-blue-900 transition-color duration-300"
          : "bg-transarent p-1 rounded flex stroke-[0.75] hover:stroke-neutral-100 stroke-neutral-400 text-neutral-400 hover:text-neutral-100 place-items-center gap-3 hover:bg-blue-900 transition-color duration-300"
      }
    >
      {children}
      <p className="text-inherit overflow-hidden whitespace-nowrap tracking-wide">
        {name}
      </p>
    </NavLink>
  );
}

export default NavigationLinks;

/**
 * 
 * <NavLink
      to={link}
      className={({ isActive }) =>
        isActive
          ? "bg-neutral-700/30 p-1 rounded flex stroke-[0.75] hover:stroke-neutral-100 stroke-neutral-400 text-neutral-400 hover:text-neutral-100 place-items-center gap-3 hover:bg-neutral-700/30 transition-color duration-100"
          : "bg-transarent p-1 rounded flex stroke-[0.75] hover:stroke-neutral-100 stroke-neutral-400 text-neutral-400 hover:text-neutral-100 place-items-center gap-3 hover:bg-neutral-700/30 transition-color duration-100"
      }
    >
      {children}
      <p className="text-inherit overflow-clip whitespace-nowrap tracking-wide">
        {name}
      </p>
    </NavLink>
 */
