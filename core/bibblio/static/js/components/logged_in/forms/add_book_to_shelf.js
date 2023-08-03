
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

const AddBookToShelf = (props) => {

    const [state, setState] = React.useState({
        user: {},
        // show_modal: false,
        // fullscreen: true,
        // error: '',
        books_read: [],
        books_reading: [],
        books_to_read: [],
        shelves: [],
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

    const handle_select_change = (event) => {
        let selected_items = [].slice.call(event.target.selectedOptions).map(item => item.value);
        setState({
            ...state,
            [event.target.name]: selected_items,
        });
    }

    // const handle_show = () => {
    //     setState({
    //         ...state,
    //         show_modal: true,
    //     })
    // }

    // const handle_close = () => {
    //     setState({
    //         ...state,
    //         show_modal: false,
    //     })
    // }

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
                add_or_remove: "add",
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

    const capitalize_names = (field_name) => {
        field_name = field_name.replace("book_", "").replace("books_", "").replace("_", " ");

        //capitalize each word and replace underscores with spaces
        field_name = field_name.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        return field_name;
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
            error={props.error}
        >
            <MultiSelectInstructions />
            {/* multi selects for books */}
            <MultiSelectGroup 
                    parent_state={state}
                    handle_select_change={handle_select_change}
                    capitalize_names={capitalize_names}
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