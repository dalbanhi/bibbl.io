import React from 'react';
import ReactDOM from "react-dom";
import {createRoot} from 'react-dom/client'

import 'bootstrap/dist/css/bootstrap.css'
import './styles/styles.css'
import TestApp from './js/TestApp';


const root = document.querySelector("#root")
const app_root = createRoot(root);
  if (app_root) {
    app_root.render(<TestApp />);
  }