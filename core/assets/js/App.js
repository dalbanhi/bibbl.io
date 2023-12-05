import React from 'react';

import MyNavBar from './components/navigation/MyNavBar';
import NavBar from './components/navigation/NavBar';
import LoggedOutView from './components/loggedOut/LoggedOutView';
import LoggedInView from './components/loggedIn/LoggedInView';
import ErrorPage from './components/error/ErrorPage';
// import SignInView from './components/loggedOut/SignInView';

import Cookies from 'js-cookie';

import { useNavigate, Outlet, Routes, Route, useLocation } from 'react-router-dom';



const App = () => {

  const navigate = useNavigate();


  const [state, setState] = React.useState({
    is_authenticated: null,
    user: null,
    menu_urls: {},
    is_register_view: false,
    api_urls: {},
  });

  /** 
   * Loads data injected initially by python into the DOM
  */
  React.useEffect(() => {
    const is_authenticated = JSON.parse(
      document.querySelector(`#is_authenticated_data`).textContent,
    );

    const menu_urls = JSON.parse(
      document.querySelector(`#menu_urls_data`).textContent,
    );

    const is_register_view = JSON.parse(
      document.querySelector(`#is_register_view_data`).textContent,
    );

    const api_urls = JSON.parse(
      document.querySelector(`#api_urls_data`).textContent,
    );

    if (is_authenticated) {
      const user_data = JSON.parse(
        document.querySelector(`#user_data`).textContent,
      );
      setState({
        ...state,
        is_authenticated: is_authenticated,
        user: user_data,
        menu_urls: menu_urls,
        is_register_view: is_register_view,
        api_urls: api_urls,
      });
      navigate("my_profile", { replace: true });
    } else {
        setState({
          ...state,
          is_authenticated: is_authenticated,
          menu_urls: menu_urls,
          is_register_view: false,
          api_urls: api_urls,
        });
        navigate("login", { replace: true });
      }
      
  }, []);


  /**
   * Function to update the register view state
   * @param {boolean} is_register_view - whether the register view is active
   */
  const update_register_view = (is_register_view) => {
    // console.log("is_register_view", is_register_view);
    setState({
      ...state,
      is_register_view: !state.is_register_view,
    });

    if(!state.is_register_view){
      navigate("login", { replace: true });
    } else{
      navigate("register", { replace: true });
    }
  };


  /** 
   * Function to update user data in state.
   * Passed to login view and used extensively throughout the app to update user data
   * @param {object} user - user data
  */
  const update_user = (user) => {
    // update user data
    setState({
      ...state,
      user: user,
    });
  };

  /** 
   * Function to handle top level login and logout. 
   * tries to fetch a user id from the server and updates state accordingly
   * @param {string} login_or_out - "login" or "out"
   * @param {number} user_id - user id
  */
  const handle_login = (login_or_out, user_id) => {
    //get user data and update url name for my profile
    let user;
    if (login_or_out === "login") {
      fetch(`/users/${user_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          user = data;
          setState({
            ...state,
            is_authenticated: login_or_out === "login" ? true : false,
            user: user,
          });

          // update the url to be my_profile
          navigate("my_profile", { replace: true });

        });
    }
  };

  return (
    <main>
      <NavBar
        is_authenticated={state.is_authenticated}
        user={state.user}
        menu_urls={state.menu_urls}
        auth_change={handle_login}
        update_register_view={update_register_view}
      />
      <div className="container">
        <Routes>
          <Route 
            path="login" 
            element={
            <LoggedOutView
              is_register_view={false}
              menu_urls={state.menu_urls}
              auth_change={handle_login}
              />} 
          />
          <Route 
            path="logout" 
            element={
            <LoggedOutView
              is_register_view={false}
              menu_urls={state.menu_urls}
              auth_change={handle_login}
              />} 
          />
          <Route 
            path="register" 
            element={
            <LoggedOutView
              is_register_view= {true}
              menu_urls={state.menu_urls}
              auth_change={handle_login}
              />} 
          />
          <Route
            path="my_profile"
            element={
              <LoggedInView
                user={state.user}
                api_urls={state.api_urls}
                update_user={update_user}
              />
            }
          />
        </Routes>
        {/* {console.log(state.is_authenticated)}
        {! state.is_authenticated ? (
          <Navigate to="/my_app/login" replace={true} />
        ):(
          <Navigate to="/my_app/my_profile" replace={true} />
        )}
        <Outlet /> */}
        {/* {!state.is_authenticated ? (
          <LoggedOutView
            is_register_view={state.is_register_view}
            menu_urls={state.menu_urls}
            auth_change={handle_login}
          />
        ) : (
          // <Navigate to="/my_profile" replace={true} />
          <LoggedInView
            user={state.user}
            api_urls={state.api_urls}
            update_user={update_user}
          />
        )} */}
      </div>
    </main>
  )
}

export default App;