import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Homepage from "./routes/homePage/Homepage";
import Dashboard from "./routes/dashBoard/Dashboard";
import Chatpage from "./routes/chatPage/Chatpage";
import RootLayout from './layouts/rootLayout/RootLayout';
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout';
import Signinpage from './routes/signInPage/Signinpage';
import Signuppage from './routes/signUpPage/Signuppage';

const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    children: [
      {
        path: "/",
        element: <Homepage/>,
      },
      {
        path: "/sign-in/*",
        element: <Signinpage/>,
      },
      {
        path: "/sign-up/*",
        element: <Signuppage/>,
      },
      {
        element: <DashboardLayout/>,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard/>,
          },
          {
            path: "/dashboard/chats/:id",
            element: <Chatpage/>,
          },
        ],   
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
