// ReactBootstrap.Modal ideas from: https://react-bootstrap.netlify.app/docs/components/ReactBootstrap.Modal/
// ideas for multi select using react bootstrap: https://stackoverflow.com/questions/54573926/how-to-use-multi-select-dropdown-in-react-bootstrap


/**
 * A stylized button to be passed to ModalFormWithButton, specific to editing a shelf
 * @param {function} props.handle_show - function to show modal 
 * @returns {object} - ReactBootstrap.Button
 */
const EditShelfBadge = (props) => {
  return (
    <ClickableBadge
      bg="warning"
      on_click={props.handle_show}
      name="Remove Books from Shelf"
    />
  );
};

/**
 * A form with a stylized button to edit a shelf in the user's library. 
 * It's a child of ModalFormBase and passes specific children to ModalFormWithButton
 * @param {object} props.user - the user object
 * @param {object} props.update_user - function to update user data in state
 * @param {object} props.set_success_message - function to set success to parent 
 * @param {string} props.edit_shelf_url - url to edit shelf
 * 
 * //render props
 * @param {boolean} props.show_modal - boolean to show modal
 * @param {function} props.set_show_modal - function to set show_modal
 * @param {function} props.capitalize_names - function to capitalize names
 * @param {string} props.error - error message
 * @param {function} props.set_error - function to set error
 * @returns 
 */
const EditShelfForm = (props) => {
  const [state, setState] = React.useState({
    user: {},
    shelf_name: "",
    books_to_remove: [],
    add_or_remove: "remove",
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

    fetch(props.edit_shelf_url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      body: JSON.stringify({
        shelf_id: props.shelf.id,
        shelf_name: state.shelf_name,
        books_to_remove: state.books_to_remove,
        add_or_remove: state.add_or_remove,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
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
            books_to_remove: [],
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
        <EditShelfBadge handle_show={() => props.set_show_modal(true)} />
      }
      title="Edit a Shelf in Your Library"
      handle_submit={handle_submit}
      handle_close={() => props.set_show_modal(false)}
      submit_button_text="Edit Shelf"
      submit_button_color="primary"
      show_modal={props.show_modal}
      error={props.error}
    >
      <TextControls
        parent_state={state}
        handle_input_change={handle_input_change}
        capitalize_names={props.capitalize_names}
        fields={["shelf_name"]}
        form_name="edit_shelf_form"
      />
      <hr></hr>
      <ReactBootstrap.Form.Label>
        Remove books from shelf
      </ReactBootstrap.Form.Label>
      <MultiSelectInstructions />
      {/* multi selects for books */}
      <MultiSelect
        form_name="edit_shelf_form"
        label="Remove these books from shelf"
        name="books_to_remove"
        value={state.books_to_remove}
        handle_change={handle_select_change}
        items_to_display={props.shelf.books}
        item_type="book"
        show_instructions={false}
      />
    </ModalFormWithButton>
  );
};
