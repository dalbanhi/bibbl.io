import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
// importing styles
import 'bootstrap/dist/css/bootstrap.css'
import './styles/styles.css'

import App from './js/App';
import ErrorPage from "./js/components/error/ErrorPage";


const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />
  },
  {
    path: "/my_app//*",
    element: <App/>,
    errorElement: <ErrorPage />,
    // children: [
    //   {
    //     path: "/my_app/login",
    //     element: <TestLoggedOut />,
    //   },
    //   // {
    //   //   path: "/register",
    //   //   element: <LoggedOutView />,
    //   // },
    //   {
    //     path: "/my_app/my_profile",
    //     element: <TestLoggedIn/>,
    //   },

    // ],
  },
  // {
  //   path: "/my_profile",
  //   element: <h1>Hello</h1>,
  //   errorElement: <ErrorPage />
  // },
]);


// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route 
//       element={<App/>}
//       path="/my_app"
//       errorElement={<ErrorPage />}
//       children={[
//         <Route
//           element={<TestLoggedOut />}
//           path="login"
//         />,
//       ]}
//     />
//   )
// );

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);