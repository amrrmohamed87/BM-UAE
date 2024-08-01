import { motion } from "framer-motion";
import {
  ArchiveRestore,
  CheckCheck,
  CornerDownRight,
  FilePlus2,
  GitPullRequest,
  HandCoins,
  ListChecks,
  ListChecksIcon,
  LucideEye,
  NotebookPen,
  PackageCheck,
  PackagePlus,
  PenIcon,
  Scan,
  ScanBarcode,
  ScanEye,
  ScanSearch,
  SearchCheck,
  X,
} from "lucide-react";
import NavigationLinks from "./NavigationLinks";
import { useState } from "react";

const variants = {
  close: {
    x: -300,
    opacity: 0,
  },
  open: {
    x: 0,
    opacity: 100,
  },
};

export function TritonNavigations({
  selectedForm,
  isOpen,
  isClosed,
  sideBarIsOpen,
  closeOriginalSideBar,
}) {
  return (
    <motion.nav
      variants={variants}
      initial="close"
      animate="open"
      exit="close"
      transition={{
        duration: 0.25,
        ease: "easeInOut",
      }}
      className={`h-full flex flex-col gap-8 w-64 fixed bg-neutral-50 z-10 ml-0 ${
        isOpen && sideBarIsOpen ? "left-64" : "left-20"
      }  p-5`}
    >
      <div className="flex flex-row w-full justify-between place-items-center">
        <h1 className="tracking-wide text-neutral-800 text-lg">
          {selectedForm}
        </h1>
        <button onClick={isClosed}>
          <X />
        </button>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <NavigationLinks
          closeSidebar={() => {
            isClosed();
            closeOriginalSideBar();
          }}
          name="Triton - Prepare"
          link="/Triton-prepare"
        >
          <NotebookPen className="stroke-[0.75] stroke-inherit min-w-8 w-8" />
        </NavigationLinks>
        <NavigationLinks
          closeSidebar={() => {
            isClosed();
            closeOriginalSideBar();
          }}
          name="Prepare - Review"
          link="/Triton-prepare-review"
        >
          <LucideEye className="stroke-[0.75] stroke-inherit min-w-8 w-8" />
        </NavigationLinks>
        <NavigationLinks
          closeSidebar={() => {
            isClosed();
            closeOriginalSideBar();
          }}
          name="Prepare - Archive"
          link="/Triton-prepare-archive"
        >
          <ArchiveRestore className="stroke-[0.75] stroke-inherit min-w-8 w-8" />
        </NavigationLinks>
        <hr />

        <NavigationLinks
          closeSidebar={() => {
            isClosed();
            closeOriginalSideBar();
          }}
          name="Triton - Inventory"
          link="/CAP-po-review"
        >
          <CornerDownRight className="stroke-[0.75] stroke-inherit min-w-8 w-8" />
        </NavigationLinks>

        <NavigationLinks
          closeSidebar={() => {
            isClosed();
            closeOriginalSideBar();
          }}
          name="Inventory - Review"
          link="/CAP-po-review"
        >
          <CheckCheck className="stroke-[0.75] stroke-inherit min-w-8 w-8" />
        </NavigationLinks>

        <NavigationLinks
          closeSidebar={() => {
            isClosed();
            closeOriginalSideBar();
          }}
          name="Inventory - Archive"
          link="/CAP-po-archive"
        >
          <ArchiveRestore className="stroke-[0.75] stroke-inherit min-w-8 w-8" />
        </NavigationLinks>

        <hr />

        <NavigationLinks
          closeSidebar={() => {
            isClosed();
            closeOriginalSideBar();
          }}
          name="Triton - Invoice"
          link="/CAP-invoice"
        >
          <HandCoins className="stroke-[0.75] stroke-inherit min-w-8 w-8" />
        </NavigationLinks>
        <NavigationLinks
          closeSidebar={() => {
            isClosed();
            closeOriginalSideBar();
          }}
          name="Invoice - review"
          link="/CAP-invoice-review"
        >
          <SearchCheck className="stroke-[0.75] stroke-inherit min-w-8 w-8" />
        </NavigationLinks>
        <NavigationLinks
          closeSidebar={() => {
            isClosed();
            closeOriginalSideBar();
          }}
          name="Invoice - Archive"
          link="/CAP-invoice-archive"
        >
          <ArchiveRestore className="stroke-[0.75] stroke-inherit min-w-8 w-8" />
        </NavigationLinks>
      </div>
    </motion.nav>
  );
}

export default TritonNavigations;
