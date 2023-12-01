import React from "react";

import QuickActions from "./quickActions/QuickActions";
import FilterableList from "./filterableList/FilterableList";
// bootstrap icons:
// book: https://icons.getbootstrap.com/icons/book/
// bookshelf: https://icons.getbootstrap.com/icons/bookshelf/
// bookmark: https://icons.getbootstrap.com/icons/bookmark/

/**
 * The main logged in view of the app. Holds quick actions (three buttons), and a filterable list of items (books, and reading sessions in the future)
 * @param {object} props.user - the user object
 * @param {object} props.api_urls - the api urls object holding links to access the api
 * @param {function} props.update_user - the function to update the user object in state at the app level
 * @returns 
 */
const LoggedInView = (props) => {
    const [state, setState] = React.useState({
      user: {},
      api_urls: {},
      message: "",
      subtitle: "",
    });
  
    React.useEffect(() => {
      //update state on props load
      if (props.user && Object.entries(props.user).length !== 0) {

        setState({
          ...state,
          user: props.user,
          api_urls: props.api_urls,
          subtitle: "All Books",
        });
      }
    }, [props]);
  
    const handle_book_list_name_change = (new_book_list) => {
      const found_shelf = state.user.shelves.find(
        (shelf) => shelf.name === new_book_list,
      );
  
      setState({
        ...state,
        subtitle: found_shelf ? found_shelf.name : "All Books",
      });
    };
  
    if (Object.entries(state.user).length === 0) {
      return false;
    }
    return (
      <div className="text-center">
        <h1>{`${props.user.username}'s Library`}</h1>
        <QuickActions 
          user={state.user}
          update_user={props.update_user}
          api_urls={state.api_urls}
        />
        <p className="m-2">
          Hint: Select a single shelf to edit the shelf name or remove it from you
          library.{" "}
        </p>
        <FilterableList
          user={state.user}
          book_url={state.api_urls.book}
          shelf_url={state.api_urls.shelf}
          initial_book_list_name={state.subtitle}
          update_user={props.update_user}
        />
      </div>
    );
  };

  
  export default LoggedInView;