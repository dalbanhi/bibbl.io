import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import ClickableBadge from "./clickableBadge";
import ModalFormBase from "../../../forms/modalForms/ModalFormBase";
import EditBookForm from "../../../forms/modalForms/formInstances/editBookForm";
import RemoveBookForm from "../../../forms/modalForms/formInstances/removeBookForm";



/**
 * 
 * @param {object} props - passed in by parent component
 * @param {object} props.book - book object
 * @param {object} props.user - user object
 * @param {function} props.on_category_change - function to handle category change
 * @param {function} props.on_shelf_change - function to handle shelf change
 * //TODO: remove set_success_message as prop since this how holds the messages, remove it also from where it is being called
 * @param {function} props.set_success_message - function to set success message
 * @param {string} props.book_url - url for book endpoint
 * @param {function} props.update_user - function to update user
 * @returns 
 */
const BookCard = (props) => {
    const category_mappings = {
      read: {
        name: "Read",
        bg: "dark",
        value: "books_read",
      },
      reading: {
        name: "Reading",
        bg: "success",
        value: "books_reading",
      },
      to_read: {
        name: "To Read",
        bg: "info",
        value: "books_to_read",
      },
    };
  
    const [state, setState] = React.useState({
      book: {},
      user: {},
      book_shelves: [],
      which_category: "",
      message: "",
    });
  
    React.useEffect(() => {
      //update state on props change
      setState({
        ...state,
        book: props.book,
        user: props.user,
        //filter shelves to only those that the book is in
        book_shelves: props.user.shelves.filter((shelf) => {
          return props.book.in_shelves.includes(shelf.id);
        }),
        //set which category the book is in
        which_category: props.book.in_read.includes(props.user.id)
          ? "read"
          : props.book.in_reading.includes(props.user.id)
          ? "reading"
          : "to_read",
      });
    }, [props]);
  
    const set_message = (message) => {
      setState({
        ...state,
        message: message,
      });
    };
  
    const clear_message = () => {
      set_message("");
    };
  
    if (Object.keys(state.book).length === 0) {
      return false;
    }
    return (
      <div className="mb-1">
        <Card>
          <Card.Img
            variant="top"
            src={state.book.cover_image_url}
          />
          <Card.Title>
            {state.book.title}
          </Card.Title>
          <Card.Body>
            <Card.Text>
              by {state.book.main_author}
            </Card.Text>
            <ListGroup className="list-group-flush">
              <ListGroup.Item>
                Publication Year: {state.book.publication_year}
              </ListGroup.Item>
              <ListGroup.Item>
                Your Shelves:{" "}
                {
                  //return a badge per shelf
                  state.book_shelves.map((shelf) => {
                    return (
                      <ClickableBadge
                        key={shelf.id}
                        bg="secondary"
                        name={shelf.name}
                        on_click={props.on_shelf_change}
                        value={shelf.id}
                      />
                    );
                  })
                }
              </ListGroup.Item>
              <ListGroup.Item>
                Current Category:
                <ClickableBadge
                  on_click={props.on_category_change}
                  bg={category_mappings[state.which_category].bg}
                  name={category_mappings[state.which_category].name}
                  value={category_mappings[state.which_category].value}
                />
              </ListGroup.Item>
              <ListGroup.Item>
                <ModalFormBase
                  user={state.user}
                  render={(
                    show_modal,
                    set_show_modal,
                    error,
                    set_error,
                    capitalize_names,
                  ) => {
                    return (
                      <EditBookForm
                        user={state.user}
                        book={state.book}
                        book_shelves={state.book_shelves}
                        which_category={state.which_category}
                        update_user={props.update_user}
                        set_success_message={set_message}
                        book_url={props.book_url}
                        //render props
                        show_modal={show_modal}
                        set_show_modal={set_show_modal}
                        capitalize_names={capitalize_names}
                        error={error}
                        set_error={set_error}
                      />
                    );
                  }}
                />
                <ModalFormBase
                  user={state.user}
                  render={(
                    show_modal,
                    set_show_modal,
                    error,
                    set_error,
                    capitalize_names,
                  ) => {
                    return (
                      <RemoveBookForm
                        user={state.user}
                        book={state.book}
                        book_shelves={state.book_shelves}
                        which_category={state.which_category}
                        update_user={props.update_user}
                        set_success_message={set_message}
                        book_url={props.book_url}
                        //render props
                        show_modal={show_modal}
                        set_show_modal={set_show_modal}
                        capitalize_names={capitalize_names}
                        error={error}
                        set_error={set_error}
                      />
                    );
                  }}
                />
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
  
        {/* adding an alert message on form submissions */}
        {state.message && (
          <div
            className="dissappearing-message alert alert-success"
            role="alert"
            onAnimationIteration={clear_message}
          >
            {state.message}
          </div>
        )}
      </div>
    );
  };

  export default BookCard;
  