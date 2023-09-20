import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
// importing styles
import 'bootstrap/dist/css/bootstrap.css'
import './styles/styles.css'

import TestApp from './js/TestApp';
import ErrorPage from "./js/components/error/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TestApp/>,
    errorElement: <ErrorPage />
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);