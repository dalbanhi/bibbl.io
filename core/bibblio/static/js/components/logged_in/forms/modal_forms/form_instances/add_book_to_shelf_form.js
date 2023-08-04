/**
 * A stylized button to be passed to ModalFormWithButton, specific to adding a book to a shelf
 * @param {function} props.handle_show - function to show modal 
 * @returns {object} - ReactBootstrap.Button
 */
const AddBooksToShelfButton = (props) => {
    return(
        <ReactBootstrap.Button
                variant="outline-primary"
                onClick={props.handle_show}
        >           
            <i className="bi bi-bookmark">{` `}</i>
            Add Book(s) to Shelf
        </ReactBootstrap.Button>
    )
}

/**
 * A form with a stylized button to add books to shelves
 * It's a child of ModalFormBase and passes specific children to ModalFormWithButton
 * @param {object} props.user - the user object
 * @param {object} props.update_user - function to update user data in state
 * @param {object} props.set_success_message - function to set success to parent 
 * @param {string} props.add_book_to_shelf_url - url to add books(s) to shelf(s
 * 
 * //render props
 * @param {boolean} props.show_modal - boolean to show modal
 * @param {function} props.set_show_modal - function to set show_modal
 * @param {function} props.capitalize_names - function to capitalize names
 * @param {string} props.error - error message
 * @param {function} props.set_error - function to set error
 * @returns 
 */
const AddBookToShelfForm = (props) => {

    const [state, setState] = React.useState({
        user: {},
        books_read: [],
        books_reading: [],
        books_to_read: [],
        shelves: [],
        add_or_remove: "add",
    })

    React.useEffect(() => {
        //update state on props load
        if(Object.entries(props.user).length !== 0){
            setState({
                ...state,
                user: props.user,
            })
        }
    }, [props])

      //handle_input_change and handle_select change are repeated across form instances, but I could not get them to work as a single function as part of modal form base, since the state fields would be different for each form instance
    const handle_select_change = (event) => {
        let selected_items = [].slice.call(event.target.selectedOptions).map(item => item.value);
        setState({
            ...state,
            [event.target.name]: selected_items,
        });
    }

    const handle_submit = (event) => {
        console.log("submitting form");
        event.preventDefault();

        //try to add book(s) to shelf(s)
        fetch(props.add_book_to_shelf_url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({
                books_read: state.books_read,
                books_reading: state.books_reading,
                books_to_read: state.books_to_read,
                shelves: state.shelves,
                add_or_remove: state.add_or_remove,
            }),

        })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            //if there's an error
            if (data.error){
                props.set_error(data.error);
            }
            else{
                //if no error, update user, set success message, and close modal
                props.update_user(data.user);
                props.set_success_message(data.message);
                props.set_error('');
                props.set_show_modal(false);
                setState({
                    ...state,
                    show_modal: false,
                    error: '',
                    books_read: [],
                    books_reading: [],
                    books_to_read: [],
                    shelves: [],
                })
            }
        })
    }

    if(Object.entries(state.user).length === 0){
        return false;
    }
    return (
        <ModalFormWithButton
            form_button={<AddBooksToShelfButton handle_show={() => props.set_show_modal(true)}/>}
            title="Add books(s) to shelf/shelves"
            handle_submit={handle_submit}
            handle_close={() => props.set_show_modal(false)}
            submit_button_text="Add to Shelf"
            show_modal={props.show_modal}
            submit_button_color="primary"
            error={props.error}
        >
            <MultiSelectInstructions />
            {/* multi selects for books */}
            <MultiSelectGroup 
                    parent_state={state}
                    handle_select_change={handle_select_change}
                    capitalize_names={props.capitalize_names}
                    fields={Object.keys(state.user).filter(key => key.startsWith("books_"))}
                />
            {/* multi select for Shelf */}
            <MultiSelect
                control_id="add_book_form.shelf"
                label="Shelves (all books selected will be added to all selected shelves). Repeats are ignored."
                name="shelves"
                value={state.shelves}
                handle_change={handle_select_change}
                items_to_display={state.user.shelves}
                item_type="shelf"
                show_instructions={false}
            />
        </ModalFormWithButton>
    )
}