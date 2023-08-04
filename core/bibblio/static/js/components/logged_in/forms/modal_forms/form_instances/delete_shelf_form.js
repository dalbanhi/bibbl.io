// ReactBootstrap.Modal ideas from: https://react-bootstrap.netlify.app/docs/components/ReactBootstrap.Modal/
// ideas for multi select using react bootstrap: https://stackoverflow.com/questions/54573926/how-to-use-multi-select-dropdown-in-react-bootstrap

/**
 * A stylized button ("Badge") to be passed to ModalFormWithButton, specific to deleting a shelf
 * @param {function} props.handle_show - function to show modal 
 * @returns {object} - ReactBootstrap.Button
 */
const DeleteShelfBadge = (props) => {
  return (
    <ClickableBadge
      bg="danger"
      on_click={props.handle_show}
      name="Delete Shelf"
    />
  );
};

/**
 * A form with a stylized button to delete a shelf from the user's library
 * It's a child of ModalFormBase and passes specific children to ModalFormWithButton
 * @param {object} props.user - the user object
 * @param {object} props.update_user - function to update user data in state
 * @param {object} props.set_success_message - function to set success to parent 
 * @param {string} props.delete_shelf_url - url to add book
 * 
 * //render props
 * @param {boolean} props.show_modal - boolean to show modal
 * @param {function} props.set_show_modal - function to set show_modal
 * @param {function} props.capitalize_names - function to capitalize names
 * @param {string} props.error - error message
 * @param {function} props.set_error - function to set error
 * @returns 
 */
const DeleteShelfForm = (props) => {
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
    console.log("handle submit");

    fetch(props.edit_shelf_url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      body: JSON.stringify({
        shelf_id: props.shelf.id,
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

          props.set_success_message(data.message);
          props.set_error("");
          props.set_show_modal(false);

          //reload the entire page to avoid display error.
          //TODO: find another way to avoid this
          window.location.reload(true);
          // props.update_user(data.user);
        }
      });
  };

  if (Object.entries(state.user).length === 0) {
    return false;
  }
  return (
    <ModalFormWithButton
      form_button={
        <DeleteShelfBadge handle_show={() => props.set_show_modal(true)} />
      }
      title="Delete a Shelf in Your Library"
      handle_submit={handle_submit}
      handle_close={() => props.set_show_modal(false)}
      submit_button_text="Delete Shelf"
      submit_button_color="danger"
      show_modal={props.show_modal}
      error={props.error}
    >
      <ReactBootstrap.Modal.Body>
        Warning: This will delete the shelf and remove all books from it. This
        action cannot be undone.
      </ReactBootstrap.Modal.Body>
    </ModalFormWithButton>
  );
};
