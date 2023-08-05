/**
 * A simple view of the "logged out" state of the app. Mostly holds the login form
 * @param {object} props - passed in by parent component
 * @param {boolean} props.is_register_view - whether the user is viewing the register or login page
 * @param {function} props.auth_change - the function to change the login/out state
 * @returns {object} - React component
 */
const LoggedOutView = (props) => {
  const [state, setState] = React.useState({
    is_register_view: "",
    no_user_urls: {},
    auth_change: null,
  });

  React.useEffect(() => {
    //update state on props load
    if (Object.entries(props.menu_urls).length !== 0) {
      //get only the menu items that are not for all users
      const no_user_urls = Object.keys(props.menu_urls).reduce((acc, key) => {
        if (props.menu_urls[key].auth === "not_authenticated") {
          acc[key] = props.menu_urls[key];
        }
        return acc;
      }, {});

      setState({
        ...state,
        is_register_view: props.is_register_view,
        no_user_urls: no_user_urls,
        auth_change: props.auth_change,
      });
    }
  }, [props]);

  return (
    <div>
      <h1>Welcome</h1>
      <LogInForm
        is_register_view={state.is_register_view}
        action_urls={state.no_user_urls}
        auth_change={state.auth_change}
      />
      <h2 className="m-2">Demo</h2>
      <div className="loom-video m-2"><iframe src="https://www.loom.com/embed/34f2430708e2486ba75cbe5630406845?sid=8f06ddf7-4deb-455a-a7e1-1de7b7189e3f" frameBorder="0"  allowFullScreen className="loom-video-iframe"></iframe></div>
    </div>
  );
};
