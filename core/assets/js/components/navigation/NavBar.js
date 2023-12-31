import React from 'react';
import { Link, useLocation } from 'react-router-dom';


/**
 * A very simple navbar that displays options to login/out and register if the user is not authenticated
 * @param {object} props - passed in by parent component
 * @param {boolean} props.is_authenticated - whether the user is authenticated
 * @param {function} update_register_view - funciton to change the register view state
 * @param {object} props.user - the user data
 * @param {object} props.menu_urls - the urls for the menu items
 * @param {function} props.auth_change - the function that handles the login/logout state change
 * @returns {object} - React component
 */
const NavBar = (props) => {
  
  const loc = useLocation();

  const [state, setState] = React.useState({
    is_authenticated: null,
    variable_urls: null,
  });

  React.useEffect(() => {
    //update state on props load
    
    if (Object.entries(props.menu_urls).length !== 0) {
      
      setState({
        ...state,
        is_authenticated: props.is_authenticated,
        variable_urls: variable_menu(),
      });
    }
  }, [props]);

  const variable_menu = () => {
    //get only the menu items that are not for all users
    const varying_urls = Object.keys(props.menu_urls).reduce((acc, key) => {
      if (props.menu_urls[key].auth !== "all") {
        acc[key] = props.menu_urls[key];
      }
      return acc;
    }, {});

    if (props.is_authenticated) {
      //further reduce the menu items to only those for authenticated users
      const user_urls = Object.keys(varying_urls).reduce((acc, key) => {
        if (props.menu_urls[key].auth === "authenticated") {
          acc[key] = props.menu_urls[key];
        }
        return acc;
      }, {});
      return user_urls;
    } else if (!props.is_authenticated) {
      //further reduce the menu items to only those for unauthenticated users
      let no_user_urls = {};
      no_user_urls["LoginRegister"] = loc.pathname.includes("login") ? 
       {path: "../register", name: "Register"} : {path: "../login", name: "Login"} ;

      return no_user_urls;
    }
  };

  if (props.is_authenticated === null) {
    // https://medium.com/@davidkelley87/stop-using-return-null-in-react-a2ebf08fc9cd
    //wait to receive props from parent to render anything
    return false;
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href={props.menu_urls.index.url}>
            <img
              src= {props.menu_urls.logo.url}
              alt="Logo"
              className="d-inline-block align-text-top"
            />
            Bibbl.io
          </a>
          <div>
            <ul className="navbar-nav mr-auto">
            
              {state.variable_urls &&
                Object.entries(state.variable_urls).map(([key, value]) => {
                  return (
                    <li className="nav-item" key={key}>
                    
                      <Link className="nav-link" relative="path" to={value.path} reloadDocument={state.is_authenticated}>
                        {value.name}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </nav>
  )
}

export default NavBar;