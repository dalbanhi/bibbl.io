// ReactBootstrap.Modal ideas from: https://react-bootstrap.netlify.app/docs/components/ReactBootstrap.Modal/
// ideas for multi select using react bootstrap: https://stackoverflow.com/questions/54573926/how-to-use-multi-select-dropdown-in-react-bootstrap

const AddShelfButton = (props) => {
    return(
        <ReactBootstrap.Button
                variant="outline-primary"
        >           
            <i className="bi bi-bookshelf">{` `}</i>
            Add Shelf
        </ReactBootstrap.Button>
    )
}


const AddShelf = (props) => {
    const [state, setState] = React.useState({
        user: {},
        show_modal: false,
        shelf_name: '',
        books_read: [],
        books_reading: [],
        books_to_read: [],
        error:'',
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

    const handle_show = () => {
        setState({
            ...state,
            show_modal: true,
        })
    }

    const handle_input_change = (event) => {
        setState({
            ...state,
            [event.target.name]: event.currentTarget.value,
        })
    }

    const handle_select_change = (event) => {
        console.log("handle select change")
        let selected_items = [].slice.call(event.target.selectedOptions).map(item => item.value);
        setState({
            ...state,
            [event.target.name]: selected_items,
        });
    }

    const handle_close = () => {
        setState({
            ...state,
            show_modal: false,
        })
    }
    const handle_submit = (event) => {
        event.preventDefault();

        //try to add shelf
        fetch(props.add_shelf_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({
                name: state.shelf_name,
                books_read: state.books_read,
                books_reading: state.books_reading,
                books_to_read: state.books_to_read,
                user: state.user.id,
            })
        })
        .then(response => response.json())
        .then(data => {
            //if there's an error
            if (data.error){
                setState({
                    ...state,
                    error: data.error,
                })
            }
            //if there's no error
            else{
                //tell app to show message update state, clear form, close modal
                props.set_success_message(data.message);
                props.update_user(data.user);
                setState({
                    ...state,
                    show_modal: false,
                    shelf_name: '',
                    books_read: [],
                    books_reading: [],
                    books_to_read: [],
                    error:'',
                });

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
                form_button={AddShelfButton}
                title="Add a Shelf to Your Library"
                handle_submit={handle_submit}
                submit_button_text="Add Shelf!"
                // show_modal={state.show_modal}
                error={state.error}
            >
                <TextControls 
                    parent_state={state}
                    handle_input_change={handle_input_change}
                    capitalize_names={capitalize_names}
                    fields={["shelf_name"]}
                    form_name="add_shelf_form"
                />
                <hr></hr>
                <ReactBootstrap.Form.Label>
                    Add some books to this shelf (optional)!
                </ReactBootstrap.Form.Label>
                <MultiSelectInstructions />
                {/* multi select for books */}
                <MultiSelectGroup 
                    parent_state={state}
                    handle_select_change={handle_select_change}
                    capitalize_names={capitalize_names}
                    fields={Object.keys(state.user).filter(key => key.startsWith("books_"))}
                />
            </ModalFormWithButton>
        
    )
}