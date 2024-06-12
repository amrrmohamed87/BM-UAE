import { NavLink } from "react-router-dom";

export function NavigationLinks({ link, name, children }) {
  return (
    <NavLink
      to={link}
      className="p-1 rounded flex stroke-[0.75] hover:stroke-neutral-100 stroke-neutral-400 text-neutral-400 hover:text-neutral-100 place-items-center gap-3 hover:bg-neutral-700/30 transition-color duration-100"
    >
      {children}
      <p className="text-inherit overflow-clip whitespace-nowrap tracking-wide">
        {name}
      </p>
    </NavLink>
  );
}

export default NavigationLinks;
