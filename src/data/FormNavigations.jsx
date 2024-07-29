import { motion } from "framer-motion";
import {
  ArchiveRestore,
  FilePlus2,
  GitPullRequest,
  HandCoins,
  ListChecks,
  ListChecksIcon,
  PackageCheck,
  PackagePlus,
  PenIcon,
  Scan,
  ScanBarcode,
  ScanEye,
  ScanSearch,
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

export function FormNavigations({
  selectedForm,
  isOpen,
  setSelectedForm,
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
      <style>
        {` .glass {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 10px;
            box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.3);
          }`}
      </style>
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
          name="PFI - Request"
          link="/CAP-pfi-request"
        >
          <GitPullRequest className="stroke-[0.75] stroke-inherit min-w-8 w-8" />
        </NavigationLinks>
        <NavigationLinks
          closeSidebar={() => {
            isClosed();
            closeOriginalSideBar();
          }}
          name="PFI - Review"
          link="/CAP-pfi-review"
        >
          <PenIcon className="stroke-[0.75] stroke-inherit min-w-8 w-8" />
        </NavigationLinks>
        <NavigationLinks
          closeSidebar={() => {
            isClosed();
            closeOriginalSideBar();
          }}
          name="PFI - Archive"
          link="/CAP-pfi-archive"
        >
          <ArchiveRestore className="stroke-[0.75] stroke-inherit min-w-8 w-8" />
        </NavigationLinks>
        <hr />

        <NavigationLinks
          closeSidebar={() => {
            isClosed();
            closeOriginalSideBar();
          }}
          name="PO - Review"
          link="/CAP-po-review"
        >
          <ScanEye className="stroke-[0.75] stroke-inherit min-w-8 w-8" />
        </NavigationLinks>
        <NavigationLinks
          closeSidebar={() => {
            isClosed();
            closeOriginalSideBar();
          }}
          name="PO - Archive"
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
          name="CAP - Confirmation"
          link="/CAP-confiramtion"
        >
          <HandCoins className="stroke-[0.75] stroke-inherit min-w-8 w-8" />
        </NavigationLinks>
        <NavigationLinks
          closeSidebar={() => {
            isClosed();
            closeOriginalSideBar();
          }}
          name="CAP - Review"
          link="/CAP-confirmation-review"
        >
          <ListChecksIcon className="stroke-[0.75] stroke-inherit min-w-8 w-8" />
        </NavigationLinks>
        <NavigationLinks
          closeSidebar={() => {
            isClosed();
            closeOriginalSideBar();
          }}
          name="CAP - Archive"
          link="/CAP-confirmation-archive"
        >
          <ArchiveRestore className="stroke-[0.75] stroke-inherit min-w-8 w-8" />
        </NavigationLinks>
        <hr />
        <NavigationLinks
          closeSidebar={() => {
            isClosed();
            closeOriginalSideBar();
          }}
          name="CAP - Invoice"
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
          <ScanBarcode className="stroke-[0.75] stroke-inherit min-w-8 w-8" />
        </NavigationLinks>
        <NavigationLinks
          closeSidebar={() => {
            isClosed();
            closeOriginalSideBar();
          }}
          name="CAP - Invoice"
          link="/CAP-invoice-archive"
        >
          <ArchiveRestore className="stroke-[0.75] stroke-inherit min-w-8 w-8" />
        </NavigationLinks>
      </div>
    </motion.nav>
  );
}

export default FormNavigations;
