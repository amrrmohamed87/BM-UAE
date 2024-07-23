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
import POCreation from "./CAP/PO/POCreation";
import POConfirmation from "./CAP/PO/POConfirmation";
import CAPInvoice from "./CAP/CAPInvoice";
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
          path: "/CAP-po-creation",
          element: <POCreation />,
        },
        {
          path: "/CAP-po-confirmation",
          element: <POConfirmation />,
        },
        {
          path: "/CAP-invoice",
          element: <CAPInvoice />,
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
