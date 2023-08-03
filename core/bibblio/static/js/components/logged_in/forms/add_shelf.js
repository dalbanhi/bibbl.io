// ReactBootstrap.Modal ideas from: https://react-bootstrap.netlify.app/docs/components/ReactBootstrap.Modal/
// ideas for multi select using react bootstrap: https://stackoverflow.com/questions/54573926/how-to-use-multi-select-dropdown-in-react-bootstrap

const AddShelfButton = (props) => {
    return(
        <ReactBootstrap.Button
                variant="outline-primary"
                onClick={props.handle_show}
        >           
            <i className="bi bi-bookshelf">{` `}</i>
            Add Shelf
        </ReactBootstrap.Button>
    )
}

const AddShelf = (props) => {
    const [state, setState] = React.useState({
        user: {},
        shelf_name: '',
        books_read: [],
        books_reading: [],
        books_to_read: [],
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
                console.log(data.error);
                props.set_error(data.error);
            }
            //if there's no error
            else{
                //tell app to show message update state, clear form, close modal
                props.update_user(data.user);
                props.set_success_message(data.message);
                props.set_error('');
                props.set_show_modal(false);
                setState({
                    ...state,
                    shelf_name: '',
                    books_read: [],
                    books_reading: [],
                    books_to_read: [],
                });

            }
        })
    }

    if(Object.entries(state.user).length === 0){
        return false;
    }
    return (
            <ModalFormWithButton
                form_button={<AddShelfButton handle_show={() => props.set_show_modal(true)}/>}
                title="Add a Shelf to Your Library"
                handle_submit={handle_submit}
                handle_close={() => props.set_show_modal(false)}
                submit_button_text="Add Shelf!"
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
                <ReactBootstrap.Form.Label>
                    Add some books to this shelf (optional)!
                </ReactBootstrap.Form.Label>
                <MultiSelectInstructions />
                {/* multi selects for books */}
                <MultiSelectGroup 
                    parent_state={state}
                    handle_select_change={handle_select_change}
                    capitalize_names={props.capitalize_names}
                    fields={Object.keys(state.user).filter(key => key.startsWith("books_"))}
                />
            </ModalFormWithButton>
        
    )
}