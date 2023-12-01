import React from "react";
import Form from "react-bootstrap/Form";
import ModalFormWithButton from "../../formElements/modalFormWithButton";
import TextControls from "../../formElements/textControls";
import OpenFormButton from "../../formElements/openFormButton";
import MultiSelectGroup from "../../formElements/multiSelectGroup";
import MultiSelectInstructions from "../../formElements/multiSelectInstructions";
import Cookies from "js-cookie";

// Modal ideas from: https://react-bootstrap.netlify.app/docs/components/Modal/
// ideas for multi select using react bootstrap: https://stackoverflow.com/questions/54573926/how-to-use-multi-select-dropdown-in-react-bootstrap

  /**
   * A form with a stylized button to add a shelf to the user's library. 
   * It's a child of ModalFormBase and passes specific children to ModalFormWithButton
   * @param {object} props.user - the user object
   * @param {object} props.update_user - function to update user data in state
   * @param {object} props.set_success_message - function to set success to parent 
   * @param {string} props.add_shelf_url - url to add shelf
   * 
   * //render props
   * @param {boolean} props.show_modal - boolean to show modal
   * @param {function} props.set_show_modal - function to set show_modal
   * @param {function} props.capitalize_names - function to capitalize names
   * @param {string} props.error - error message
   * @param {function} props.set_error - function to set error
   * @returns 
   */
  const AddShelfForm = (props) => {
    const [state, setState] = React.useState({
      user: {},
      shelf_name: "",
      books_read: [],
      books_reading: [],
      books_to_read: [],
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
  
    //handle_input_change and handle_select change are repeated across form instances, but I could not get them to work as a single function as part of modal form base, since the state fields would be different for each form instance
    const handle_input_change = (event) => {
      setState({
        ...state,
        [event.target.name]: event.currentTarget.value,
      });
    };
  
    const handle_select_change = (event) => {
      let selected_items = [].slice
        .call(event.target.selectedOptions)
        .map((item) => item.value);
      setState({
        ...state,
        [event.target.name]: selected_items,
      });
    };
  
    const handle_submit = (event) => {
      event.preventDefault();
  
      //try to add shelf
      fetch(props.add_shelf_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
        body: JSON.stringify({
          name: state.shelf_name,
          books_read: state.books_read,
          books_reading: state.books_reading,
          books_to_read: state.books_to_read,
          user: state.user.id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          //if there's an error
          if (data.error) {
            props.set_error(data.error);
          }
          //if there's no error
          else {
            //tell app to show message update state, clear form, close modal
            props.update_user(data.user);
            props.set_success_message(data.message);
            props.set_error("");
            props.set_show_modal(false);
            setState({
              ...state,
              shelf_name: "",
              books_read: [],
              books_reading: [],
              books_to_read: [],
            });
          }
        });
    };
  
    if (Object.entries(state.user).length === 0) {
      return false;
    }
    return (
      <ModalFormWithButton
        form_button={
          <OpenFormButton 
            handle_show={() => props.set_show_modal(true)}
            button_text="Add Shelf"
            icon="bi bi-bookshelf"
            />
        }
        title="Add a Shelf to Your Library"
        handle_submit={handle_submit}
        handle_close={() => props.set_show_modal(false)}
        submit_button_text="Add Shelf!"
        submit_button_color="primary"
        show_modal={props.show_modal}
        error={props.error}
      >
        <TextControls
          parent_state={state}
          handle_input_change={handle_input_change}
          capitalize_names={props.capitalize_names}
          fields={["shelf_name"]}
          form_name="add_shelf_form"
        />
        <hr></hr>
        <Form.Label>
          Add some books to this shelf (optional)!
        </Form.Label>
        <MultiSelectInstructions />
        {/* multi selects for books */}
        <MultiSelectGroup
          parent_state={state}
          handle_select_change={handle_select_change}
          capitalize_names={props.capitalize_names}
          fields={Object.keys(state.user).filter((key) =>
            key.startsWith("books_"),
          )}
        />
      </ModalFormWithButton>
    );
  };

export default AddShelfForm;
  