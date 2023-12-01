import React from "react";

import ModalFormWithButton from "../../formElements/modalFormWithButton";
import TextControls from "../../formElements/textControls";
import OpenFormButton from "../../formElements/openFormButton";
import InlineRadios from "../../formElements/inlineRadios";
import MultiSelect from "../../formElements/multiSelect";
import Cookies from "js-cookie";

// ReactBootstrap.Modal ideas from: https://react-bootstrap.netlify.app/docs/components/ReactBootstrap.Modal/
// React Bootstrap Checkbox https://react-bootstrap.netlify.app/docs/forms/checks-radios
  
  /**
   * A form with a stylized button to add a book to the user's library. 
   * It's a child of ModalFormBase and passes specific children to ModalFormWithButton
   * @param {object} props.user - the user object
   * @param {object} props.update_user - function to update user data in state
   * @param {object} props.set_success_message - function to set success to parent 
   * @param {string} props.add_book_url - url to add book
   * 
   * //render props
   * @param {boolean} props.show_modal - boolean to show modal
   * @param {function} props.set_show_modal - function to set show_modal
   * @param {function} props.capitalize_names - function to capitalize names
   * @param {string} props.error - error message
   * @param {function} props.set_error - function to set error
   * @returns 
   */
  const AddBookForm = (props) => {
    //holds state actually relevant to the form
    const [state, setState] = React.useState({
      user: {},
      //order in which form will be displayed
      form_order: ["title", "authors", "publication_year", "cover_image_url"],
      title: "",
      authors: "",
      publication_year: "",
      cover_image_url: "",
      read_category: "read",
      shelves: [],
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
  
      fetch(props.add_book_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"),
        },
        body: JSON.stringify({
          title: state.title,
          authors: state.authors,
          publication_year: state.publication_year,
          cover_image_url: state.cover_image_url,
          read_category: state.read_category,
          shelves: state.shelves,
          user: state.user.id,
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
            setState({
              ...state,
              title: "",
              authors: "",
              publication_year: "",
              cover_image_url: "",
              read_category: "read",
              shelves: [],
            });
          }
        });
    };
  
    if (Object.entries(state.user).length === 0) {
      return false;
    }
    return (
        // <h1>hello</h1>
      <ModalFormWithButton
        form_button={
          <OpenFormButton 
            handle_show={() => props.set_show_modal(true)}
            button_text = "Add Book"
            icon = "bi bi-book"
          />
        }
        title="Add a Book to Your Library"
        handle_submit={handle_submit}
        handle_close={() => props.set_show_modal(false)}
        submit_button_text="Add Book!"
        submit_button_color="primary"
        show_modal={props.show_modal}
        error={props.error}
      >
         <TextControls
           parent_state={state}
           handle_input_change={handle_input_change}
           capitalize_names={props.capitalize_names}
           fields={state.form_order}
           form_name="add_book_form"
           has_previous_values={false}
         />
        <InlineRadios
          parent_state={state}
          handle_input_change={handle_input_change}
          capitalize_names={props.capitalize_names}
          fields={Object.keys(state.user).filter((key) =>
            key.startsWith("books_"),
          )}
          form_name="add_book_form"
          title="read_category"
          label={"Choose a " + props.capitalize_names("read_category")}
        />
  
        <MultiSelect
          form_name="add_book_form"
          label="Shelves"
          name="shelves"
          value={state.shelves}
          handle_change={handle_select_change}
          items_to_display={state.user.shelves}
          item_type="shelf"
          show_instructions={true}
          />
    </ModalFormWithButton>
    );

  };

export default AddBookForm;
  