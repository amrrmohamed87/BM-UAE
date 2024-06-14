import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RootLayout from "./root/RootLayout";
import OrderEntry from "./pages/OrderEntry";
import SupplyChain from "./pages/SupplyChain";
import CreateOrder from "./pages/CreateOrder";
import PurchaseOrder from "./pages/PurchaseOrder";
import AddUsers from "./pages/AddUsers";
function App() {
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
          path: "/order-entry",
          element: <OrderEntry />,
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
          path: "/create-account",
          element: <AddUsers />,
        },
      ],
    },
  ]);
  return <RouterProvider router={routes} />;
}

export default App;
