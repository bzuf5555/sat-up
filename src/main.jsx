import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/index.js'
import { Provider } from 'react-redux'
import { store } from './store/index.js'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './Pages/Login.jsx';
import SignUp from './Pages/SignUp.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import Analytics from './Pages/Analytics.jsx';
import Calendar from './Pages/Calendar.jsx';
import Chat from './Pages/Chat.jsx';
import Customer from './Pages/Customer.jsx';
import CustomerDetail from './Pages/CustomerDetail.jsx';
import FoodDetail from './Pages/FoodDetail.jsx';
import Foods from './Pages/Foods.jsx';
import OrderDetail from './Pages/OrderDetail.jsx';
import OrderList from './Pages/OrderList.jsx';
import Reviews from './Pages/Reviews.jsx';
import Wallet from './Pages/Wallet.jsx';
import PrivateRoute from './Guard/PrivateRout.jsx';

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/dashboard", element: <PrivateRoute><Dashboard /></PrivateRoute> },
  { path: "/analytics", element: <PrivateRoute><Analytics /></PrivateRoute> },
  { path: "/calendar", element: <PrivateRoute><Calendar /></PrivateRoute> },
  { path: "/chat", element: <PrivateRoute><Chat /></PrivateRoute> },
  { path: "/customer", element: <PrivateRoute><Customer /></PrivateRoute> },
  { path: "/customerdetail", element: <PrivateRoute><CustomerDetail /></PrivateRoute> },
  { path: "/fooddetail/:id", element: <PrivateRoute><FoodDetail /></PrivateRoute> },
  { path: "/foods", element: <PrivateRoute><Foods /></PrivateRoute> },
  { path: "/orderdetail", element: <PrivateRoute><OrderDetail /></PrivateRoute> },
  { path: "/orderlist", element: <PrivateRoute><OrderList /></PrivateRoute> },
  { path: "/reviews", element: <PrivateRoute><Reviews /></PrivateRoute> },
  { path: "/wallet", element: <PrivateRoute><Wallet /></PrivateRoute> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
