import { useState, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import logo from "../assets/logoIcon.png";
import { NavigationLinks } from "@/data/NavigationLinks";
import {
  BarChart,
  BarChart3,
  HandCoins,
  LayoutDashboard,
  LogInIcon,
  PackagePlus,
  Pen,
  UsersIcon,
  LogOutIcon,
  CircleUserRound,
  DollarSign,
  BadgePlus,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { TbLogout2 } from "react-icons/tb";
import { useSubmit } from "react-router-dom";

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
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const submit = useSubmit();

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

  function logoutHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    submit(null, { action: "/logout", method: "post" });
  }

  return (
    <motion.nav
      variants={sidebarVariants}
      initial="close"
      animate={sidebarControls}
      className="bg-white flex flex-col z-10 gap-16 p-5 fixed top-0 left-0 h-full border shadow-md"
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
            className="w-6 h-6 stroke-blue-900"
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

      <div className="flex items-center gap-2">
        <CircleUserRound className="stroke-[0.75] stroke-blue-900 min-w-8 w-8" />
        <p className="text-blue-900 font-semibold overflow-hidden whitespace-nowrap tracking-wide">
          {name}
        </p>
      </div>

      <div className="flex flex-col gap-3 flex-grow">
        <NavigationLinks
          closeSidebar={() => {
            setIsOpen(false);
          }}
          link="/"
          name="Dashboard"
        >
          <LayoutDashboard className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLinks>
        <NavigationLinks
          closeSidebar={() => {
            setIsOpen(false);
          }}
          link="/order-entry"
          name="Order Entry"
        >
          <Pen className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLinks>
        {/* <NavigationLinks link="/invoices" name="Invoices">
          <DollarSign className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLinks> */}
        <NavigationLinks
          closeSidebar={() => {
            setIsOpen(false);
          }}
          link="/supply-chain"
          name="Supply Chain"
        >
          <BarChart3 className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLinks>
        <NavigationLinks
          closeSidebar={() => {
            setIsOpen(false);
          }}
          link="/create-order"
          name="Create Order"
        >
          <PackagePlus className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLinks>
        <NavigationLinks
          closeSidebar={() => {
            setIsOpen(false);
          }}
          link="/purchase-order"
          name="Purchase Order"
        >
          <HandCoins className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLinks>
        <NavigationLinks
          closeSidebar={() => {
            setIsOpen(false);
          }}
          link="/add-items"
          name="Add Items"
        >
          <BadgePlus className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLinks>
        <NavigationLinks
          closeSidebar={() => {
            setIsOpen(false);
          }}
          link="/create-account"
          name="Users"
        >
          <UsersIcon className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
        </NavigationLinks>
      </div>

      <div className="flex flex-col">
        {token && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="p-1 rounded flex items-center gap-3 cursor-pointer stroke-[0.75] hover:stroke-neutral-100 stroke-neutral-400 text-neutral-400 hover:text-neutral-100 place-items-center hover:bg-blue-900 transition-color duration-300">
                <LogOutIcon className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
                <button className="text-inherit overflow-hidden whitespace-nowrap tracking-wide">
                  Logout
                </button>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white w-[320px] md:w-[500px]">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently Log you
                  out from your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex items-center gap-3">
                <AlertDialogCancel className="bg-red-600 text-white mt-1 hover:bg-red-900 hover:text-white transition-all duration-300">
                  Cancel
                </AlertDialogCancel>
                <form
                  action="/logout"
                  method="post"
                  onClick={logoutHandler}
                  className="bg-blue-600 rounded-md px-3 py-2 cursor-pointer hover:bg-blue-900 transition-all duration-300"
                >
                  <button className="text-white">Logout</button>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </motion.nav>
  );
}

export default Sidebar;
