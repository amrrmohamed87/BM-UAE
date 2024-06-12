import { useState, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import logo from "../assets/logoIcon.png";
import { NavigationLinks } from "@/data/NavigationLinks";
import { LayoutDashboard, LogInIcon } from "lucide-react";

const sidebarVariants = {
  close: {
    width: "5rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
  open: {
    width: "16rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
};

const svgVariants = {
  close: {
    rotate: 360,
  },
  open: {
    rotate: 180,
  },
};

const logoVariants = {
  close: {
    opacity: 0,
    scale: 0.5,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  open: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};
export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarControls = useAnimationControls();
  const svgControls = useAnimationControls();
  const logoControls = useAnimationControls();

  useEffect(() => {
    if (isOpen) {
      sidebarControls.start("open");
      svgControls.start("open");
      logoControls.start("open");
    } else {
      sidebarControls.start("close");
      svgControls.start("close");
      logoControls.start("close");
    }
  }, [isOpen]);

  function handleOpenClose() {
    setIsOpen(!isOpen);
  }
  return (
    <motion.nav
      variants={sidebarVariants}
      initial="close"
      animate={sidebarControls}
      className="bg-neutral-900 flex flex-col z-10 gap-20 p-5 absolute top-0 left-0 h-full shadow"
    >
      <div className="flex flex-row w-full justify-between place-items-center">
        <motion.img
          variants={logoVariants}
          initial="close"
          animate={logoControls}
          src={logo}
          className={`${isOpen ? "flex w-36" : "hidden"}`}
        />
        <button
          className="p-1 rounded-full flex"
          onClick={() => {
            handleOpenClose();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="w-6 h-6 stroke-neutral-200"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={svgVariants}
              animate={svgControls}
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <NavigationLinks link="/" name="Dashboard">
          <LayoutDashboard className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLinks>
        <NavigationLinks link="/login" name="Login">
          <LogInIcon className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLinks>
      </div>
    </motion.nav>
  );
}

export default Sidebar;
