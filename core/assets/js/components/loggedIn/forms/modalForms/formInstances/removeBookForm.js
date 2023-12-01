import React from "react";
import ClickableBadge from "../../../filterableList/itemsList/items/clickableBadge";
import ModalFormWithButton from "../../formElements/modalFormWithButton";
import { Modal } from "react-bootstrap";
import Cookies from "js-cookie";

// Modal ideas from: https://react-bootstrap.netlify.app/docs/components/Modal/
// React Bootstrap Checkboxhttps://react-bootstrap.netlify.app/docs/forms/checks-radios
  
  /**
   * A form with a stylized button to add a book to the user's library. 
   * It's a child of ModalFormBase and passes specific children to ModalFormWithButton
   * @param {object} props.user - the user object
   * @param {object} props.update_user - function to update user data in state
   * @param {object} props.set_success_message - function to set success to parent 
   * @param {string} props.book_url - url to remove the book from the user's library
   * 
   * //render props
   * @param {boolean} props.show_modal - boolean to show modal
   * @param {function} props.set_show_modal - function to set show_modal
   * @param {function} props.capitalize_names - function to capitalize names
   * @param {string} props.error - error message
   * @param {function} props.set_error - function to set error
   * @returns 
   */
  const RemoveBookForm = (props) => {
    const [state, setState] = React.useState({
      user: {},
    });
  
    React.useEffect(() => {
      //update state on props load
      if (Object.entries(props.user).length !== 0) {
        setState({
          ...state,
          user: props.user,
        });
      }
    }, [props]);
  
    const handle_submit = (event) => {
      event.preventDefault();
  
      fetch(props.book_url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
        body: JSON.stringify({
          book_id: props.book.id,
          book_in_shelves_of_user: props.book_shelves.map((shelf) => shelf.id),
          current_category: props.which_category,
          removing_book: true,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            props.set_error(data.error);
          } else {
            //if not error, tell app to show message, update state, and close modal
            props.update_user(data.user);
            props.set_success_message(data.message);
            props.set_error("");
            props.set_show_modal(false);
          }
        });
    };
  
    if (Object.entries(state.user).length === 0) {
      return false;
    }
    return (
      <ModalFormWithButton
        form_button={
          <ClickableBadge 
            on_click={() => props.set_show_modal(true)} 
            bg="danger"
            name="Remove from Library"
          />
        }
        title="Remove this book from your library?"
        handle_submit={handle_submit}
        handle_close={() => props.set_show_modal(false)}
        submit_button_text="Remove Book"
        submit_button_color="danger"
        show_modal={props.show_modal}
        error={props.error}
      >
        <Modal.Body>
          Warning: This will remove the book from your library and remove it from
          all of your shelves. This action cannot be undone.
        </Modal.Body>
      </ModalFormWithButton>
    );
  };
export default RemoveBookForm;
  