// ReactBootstrap.Modal ideas from: https://react-bootstrap.netlify.app/docs/components/ReactBootstrap.Modal/
// React Bootstrap Checkboxhttps://react-bootstrap.netlify.app/docs/forms/checks-radios

/**
 * A stylized button to be passed to ModalFormWithButton, specific to editing a book
 * @param {function} props.handle_show - function to show modal 
 * @returns {object} - ReactBootstrap.Button
 */
const EditBookBadge = (props) => {
  return (
    <ClickableBadge on_click={props.handle_show} bg="warning" name="Edit" />
  );
};

/**
 * A form with a stylized button to edit a book on the user's library. 
 * It's a child of ModalFormBase and passes specific children to ModalFormWithButton
 * @param {object} props.user - the user object
 * @param {object} props.update_user - function to update user data in state
 * @param {object} props.set_success_message - function to set success to parent 
 * @param {string} props.edit_book_url - url to add book
 * 
 * //render props
 * @param {boolean} props.show_modal - boolean to show modal
 * @param {function} props.set_show_modal - function to set show_modal
 * @param {function} props.capitalize_names - function to capitalize names
 * @param {string} props.error - error message
 * @param {function} props.set_error - function to set error
 * @returns 
 */
const EditBookForm = (props) => {
  const [state, setState] = React.useState({
    user: {},
    //order in which form will be displayed
    form_order: ["title", "authors", "publication_year", "cover_image_url"],
    title: "",
    authors: "",
    publication_year: "",
    cover_image_url: "",
    read_category: "",
    shelves_to_remove: [],
    shelves_to_add: [],
  });

  React.useEffect(() => {
    //update state on props load
    if (Object.entries(props.user).length !== 0) {
      //filtering a list by another in O(n) time
      // https://stackoverflow.com/questions/33577868/filter-array-not-in-another-array
      const shelves_map = new Map();
      for (let shelf of props.book_shelves) {
        shelves_map.set(shelf.id, true);
      }
      const available_shelves = props.user.shelves.filter(
        (shelf) => !shelves_map.has(shelf.id),
      );

      setState({
        ...state,
        user: props.user,
        available_shelves: available_shelves,
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

    fetch(props.book_url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      body: JSON.stringify({
        book_id: props.book.id,
        title: state.title,
        authors: state.authors,
        publication_year: state.publication_year,
        cover_image_url: state.cover_image_url,
        read_category: state.read_category,
        current_category: props.which_category,
        shelves_to_remove: state.shelves_to_remove,
        shelves_to_add: state.shelves_to_add,
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
            read_category: "",
            shelves_to_remove: [],
            shelves_to_add: [],
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
        <EditBookBadge handle_show={() => props.set_show_modal(true)} />
      }
      title="Edit a book in your library"
      handle_submit={handle_submit}
      handle_close={() => props.set_show_modal(false)}
      submit_button_text="Edit Book!"
      submit_button_color="primary"
      show_modal={props.show_modal}
      error={props.error}
    >
      <p>Hint: If you leave a field blank, it won't be changed.</p>
      <TextControls
        parent_state={state}
        handle_input_change={handle_input_change}
        capitalize_names={props.capitalize_names}
        fields={state.form_order}
        form_name="edit_book_form"
        current_object={props.book}
        has_previous_values={true}
      />
      <InlineRadios
        parent_state={state}
        handle_input_change={handle_input_change}
        capitalize_names={props.capitalize_names}
        fields={Object.keys(state.user).filter((key) => {
          return (
            key.startsWith("books_") &&
            key.replace("books_", "") !== props.which_category
          );
        })}
        form_name="edit_book_form"
        title="read_category"
        label="Switch to Category: "
      />

      <MultiSelect
        form_name="edit_book_form"
        label="Remove from these shelves"
        name="shelves_to_remove"
        value={state.shelves_to_remove}
        handle_change={handle_select_change}
        items_to_display={props.book_shelves}
        item_type="shelf"
        show_instructions={true}
      />

      <MultiSelect
        form_name="edit_book_form"
        label="Add to these shelves"
        name="shelves_to_add"
        value={state.shelves_to_add}
        handle_change={handle_select_change}
        items_to_display={state.available_shelves}
        item_type="shelf"
        show_instructions={false}
      />
    </ModalFormWithButton>
  );
};
