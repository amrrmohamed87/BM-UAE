import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import { action as logoutAction } from "./pages/Logout.js";
import Dashboard from "./pages/Dashboard";
import RootLayout from "./root/RootLayout";
import OrderEntry from "./pages/OrderEntry";
import SupplyChain from "./pages/SupplyChain";
import CreateOrder from "./pages/CreateOrder";
import PurchaseOrder from "./pages/PurchaseOrder";
import AddUsers from "./pages/AddUsers";
import AddItems from "./pages/AddItems";
import PFIRequest from "./CAP/PFI/PFIRequest";
import PFIReview from "./CAP/PFI/PFIReview";

import CAPInvoice from "./CAP/CAPInvoice/CAPInvoice";
import POArchive from "./CAP/PO/POArchive";
import CAPReview from "./CAP/CAPConfirmation/CAPReview";
import CAPArchive from "./CAP/CAPConfirmation/CAPArchive";
import InvoiceReview from "./CAP/CAPInvoice/InvoiceReview";
import InvoiceArchive from "./CAP/CAPInvoice/InvoiceArchive";
import POReview from "./CAP/PO/POReview";
import PFIArchive from "./CAP/PFI/PFIArchive";
import TritonPrepare from "./Triton/Prepare/TritonPrepare";
import PrepareReview from "./Triton/Prepare/PrepareReview";
import PrepareArchive from "./Triton/Prepare/PrepareArchive";
function App() {
  //const location = useLocation();
  const isAuthenticated = localStorage.getItem("token");

  /* if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  } */

  const routes = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/logout",
          action: logoutAction,
        },
        {
          path: "/order-entry",
          element: <OrderEntry />,
        },
        {
          path: "/CAP-pfi-request",
          element: <PFIRequest />,
        },
        {
          path: "/CAP-pfi-review",
          element: <PFIReview />,
        },
        {
          path: "/CAP-pfi-archive",
          element: <PFIArchive />,
        },
        {
          path: "/CAP-po-review",
          element: <POReview />,
        },
        {
          path: "/CAP-po-archive",
          element: <POArchive />,
        },
        {
          path: "/CAP-confirmation-review",
          element: <CAPReview />,
        },
        {
          path: "/CAP-confirmation-archive",
          element: <CAPArchive />,
        },
        {
          path: "/CAP-invoice",
          element: <CAPInvoice />,
        },
        {
          path: "/CAP-invoice-review",
          element: <InvoiceReview />,
        },
        {
          path: "/CAP-invoice-archive",
          element: <InvoiceArchive />,
        },
        {
          path: "/Triton-prepare",
          element: <TritonPrepare />,
        },
        {
          path: "/Triton-prepare-review",
          element: <PrepareReview />,
        },
        {
          path: "/Triton-prepare-archive",
          element: <PrepareArchive />,
        },
        {
          path: "/supply-chain",
          element: <SupplyChain />,
        },
        {
          path: "/create-order",
          element: <CreateOrder />,
        },
        {
          path: "/purchase-order",
          element: <PurchaseOrder />,
        },
        {
          path: "/add-items",
          element: <AddItems />,
        },
        {
          path: "/create-account",
          element: <AddUsers />,
        },
      ],
    },
  ]);
  return <RouterProvider router={routes} />;
}

export default App;
