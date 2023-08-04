// ReactBootstrap.Modal ideas from: https://react-bootstrap.netlify.app/docs/components/ReactBootstrap.Modal/
// ideas for multi select using react bootstrap: https://stackoverflow.com/questions/54573926/how-to-use-multi-select-dropdown-in-react-bootstrap

const EditShelfButton = (props) => {
    return(
        <ClickableBadge
            bg="warning"
            onClick={props.handle_show}
            name="Remove Books from Shelf"
        />
    )
}

const EditShelfForm = (props) => {
    const [state, setState] = React.useState({
        user: {},
        shelf_name: '',
        books_to_remove: [],
        add_or_remove: 'remove',
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
        console.log("handle submit")

        fetch(props.edit_shelf_url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({
                shelf_id: props.shelf.id,
                shelf_name: state.shelf_name,
                books_to_remove: state.books_to_remove,
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
                    books_to_remove: [],
                })
            }
        })

        //try to add shelf
        // fetch(props.add_shelf_url, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-CSRFToken': Cookies.get('csrftoken'),
        //     },
        //     body: JSON.stringify({
        //         name: state.shelf_name,
        //         books_read: state.books_read,
        //         books_reading: state.books_reading,
        //         books_to_read: state.books_to_read,
        //         user: state.user.id,
        //     })
        // })
        // .then(response => response.json())
        // .then(data => {
        //     //if there's an error
        //     if (data.error){
        //         console.log(data.error);
        //         props.set_error(data.error);
        //     }
        //     //if there's no error
        //     else{
        //         //tell app to show message update state, clear form, close modal
        //         props.update_user(data.user);
        //         props.set_success_message(data.message);
        //         props.set_error('');
        //         props.set_show_modal(false);
        //         setState({
        //             ...state,
        //             shelf_name: '',
        //             books_read: [],
        //             books_reading: [],
        //             books_to_read: [],
        //         });

        //     }
        // })
    }

    if(Object.entries(state.user).length === 0){
        return false;
    }
    return (
            <ModalFormWithButton
                form_button={<EditShelfButton handle_show={() => props.set_show_modal(true)}/>}
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
                    label="Remoe these books from shelf"
                    name="books_to_remove"
                    value={state.books_to_remove}
                    handle_change={handle_select_change}
                    items_to_display={props.shelf.books}
                    item_type="book"
                    show_instructions={false}
                />
                {/* <MultiSelectGroup 
                    parent_state={state}
                    handle_select_change={handle_select_change}
                    capitalize_names={props.capitalize_names}
                    fields={Object.keys(state.user).filter(key => key.startsWith("books_"))}
                /> */}
            </ModalFormWithButton>
    )
}