import React from "react";

import CSRFToken from "../../util/cookies/CSRFToken";
import Cookies from "js-cookie";

/**
 * A very small helper component showing text and a link to switch between login and register views of the form
 * @param {object} props - passed in by parent component
 * @param {boolean} props.is_registering - whether the user is viewing the register or login page
 * @param {object} props.action_urls - the urls for the login/register actions
 * @param {function} props.mode_switch - the function to change the login/register state from the parent
 * @returns {object} - React component
 */
const ModeSwitch = (props) => {
    const [state, setState] = React.useState({
      string_shown: "",
      title: "",
      url: "",
    });
  
    React.useEffect(() => {
      //update state on props load
      if (Object.entries(props.action_urls).length !== 0) {
        setState({
          ...state,
          string_shown: props.is_registering
            ? "Already have an account? "
            : "Don't have an account? ",
          title: props.is_registering
            ? props.action_urls.login.name
            : props.action_urls.register.name,
          url: props.is_registering
            ? props.action_urls.login.url
            : props.action_urls.register.url,
        });
      }
    }, [props]);
    return (
      <div>
        {state.string_shown}
        <a href={state.url} onClick={props.mode_switch}>
          {state.title} here
        </a>
        .
      </div>
    );
  };
  
  /**
   * 
   * @param {object} props - passed in by parent component
   * @param {boolean} props.is_register_view - whether the user is viewing the register or login version of the form
   * @param {object} props.action_urls - the urls for the login and register actions
   * @param {function} props.auth_change - the function to change the login/out state
   * @returns {object} - React component
   */
  const LogInForm = (props) => {
    const [state, setState] = React.useState({
      url_to_follow: "",
      title: "",
      is_registering: null,
      is_logging_in: null,
      username: "",
      email: "",
      password: "",
      confirmation: "",
      message: "",
    });
  
    React.useEffect(() => {
      //update state on props load
      if (Object.entries(props.action_urls).length !== 0) {
        setState({
          ...state,
          url_to_follow: props.is_register_view
            ? props.action_urls.register.url
            : props.action_urls.login.url,
          title: props.is_register_view
            ? props.action_urls.register.name
            : props.action_urls.login.name,
          is_registering: props.is_register_view,
          is_logging_in: !props.is_register_view,
          title: props.is_register_view
            ? props.action_urls.register.name
            : props.action_urls.login.name,
        });
      }
    }, [props]);
  
    const handle_input_change = (event) => {
      setState({
        ...state,
        [event.target.name]: event.target.value,
      });
    };
  
    const mode_switch = () => {
      setState({
        ...state,
        is_registering: !state.is_registering,
        is_logging_in: !state.is_logging_in,
        url_to_follow: !state.is_registering
          ? props.action_urls.register.url
          : props.action_urls.login.url,
        title: state.is_registering
          ? props.action_urls.login.name
          : props.action_urls.register.name,
      });
    };
  
    const handle_submit = (event) => {
      event.preventDefault();
      console.log(state);
      fetch(state.url_to_follow, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
        body: JSON.stringify({
          username: state.username,
          email: state.email,
          password: state.password,
          confirmation: state.confirmation,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setState({
              ...state,
              message: data.error,
            });
          } else {
            //if no error, tell app to change state to logged in
            props.auth_change("login", data.user_id);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    };
  
    return (
      <div>
        <h2>{state.title}</h2>
        <div>{state.message}</div>
        <form onSubmit={handle_submit}>
          <div className="form-group m-2">
            <input
              className="form-control"
              autoFocus
              type="text"
              name="username"
              placeholder="Username"
              onChange={handle_input_change}
              defaultValue={state.username}
            ></input>
          </div>
          {state.is_registering && (
            <div className="form-group m-2">
              <input
                className="form-control"
                type="text"
                name="email"
                placeholder="Email"
                onChange={handle_input_change}
                defaultValue={state.email}
              ></input>
            </div>
          )}
          <div className="form-group m-2">
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handle_input_change}
              defaultValue={state.password}
            ></input>
          </div>
          {state.is_registering && (
            <div className="form-group m-2">
              <input
                className="form-control"
                type="password"
                name="confirmation"
                placeholder="Confirm Password"
                onChange={handle_input_change}
                defaultValue={state.confirmation}
              ></input>
            </div>
          )}
          <CSRFToken/>
          <button type="submit" className="btn btn-primary">
            {state.title}
          </button>
        </form>
        <ModeSwitch
          action_urls={props.action_urls}
          mode_switch={mode_switch}
          is_registering={state.is_registering}
        />
      </div>
    );
  };

  export default LogInForm;