import React from 'react';


/**
 * A very simple navbar that displays options to login/out and register if the user is not authenticated
 * @param {object} props - passed in by parent component
 * @param {boolean} props.is_authenticated - whether the user is authenticated
 * @param {object} props.user - the user data
 * @param {object} props.menu_urls - the urls for the menu items
 * @param {function} props.auth_change - the function to change the login/out state
 * @returns {object} - React component
 */
const MyNavBar = (props) => {
  const [state, setState] = React.useState({
    is_authenticated: null,
    variable_urls: null,
    show_links: false,
  });

  React.useEffect(() => {
    //update state on props load
    if (Object.entries(props.menu_urls).length !== 0) {
      // let varmenu = variable_menu();
      setState({
        ...state,
        is_authenticated: props.is_authenticated,
        variable_urls: variable_menu(),
        show_links: true,
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

    if (props.is_authenticated === true) {
      //further reduce the menu items to only those for authenticated users
      const user_urls = Object.keys(varying_urls).reduce((acc, key) => {
        if (props.menu_urls[key].auth === "authenticated") {
          acc[key] = props.menu_urls[key];
        }
        return acc;
      }, {});
      return user_urls;
    } else if (props.is_authenticated === false) {
      //further reduce the menu items to only those for unauthenticated users
      const no_user_urls = Object.keys(varying_urls).reduce((acc, key) => {
        if (props.menu_urls[key].auth === "not_authenticated") {
          acc[key] = props.menu_urls[key];
        }
        return acc;
      }, {});

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
          {/* <a className="navbar-brand" href="#"> */}
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
                      <a className="nav-link" href={value.url}>
                        {value.name}
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </nav>
  )
}

export default MyNavBar;