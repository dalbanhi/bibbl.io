// ReactBootstrap.Modal ideas from: https://react-bootstrap.netlify.app/docs/components/ReactBootstrap.Modal/
// ideas for multi select using react bootstrap: https://stackoverflow.com/questions/54573926/how-to-use-multi-select-dropdown-in-react-bootstrap

const DeleteShelfBadge = (props) => {
    return(
        <ClickableBadge
            bg="danger"
            onClick={props.handle_show}
            name="Delete Shelf"
        />
    )
}

const DeleteShelfForm = (props) => {
    const [state, setState] = React.useState({
        user: {},
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
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({
                shelf_id: props.shelf.id,
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
                
                props.set_success_message(data.message);
                props.set_error('');
                props.set_show_modal(false);

                //reload the entire page
                window.location.reload(true);
                // props.update_user(data.user);
            }
        })

        // fetch(props.edit_shelf_url, {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-CSRFToken': Cookies.get('csrftoken'),
        //     },
        //     body: JSON.stringify({
        //         shelf_id: props.shelf.id,
        //         shelf_name: state.shelf_name,
        //         books_to_remove: state.books_to_remove,
        //         add_or_remove: state.add_or_remove,
        //     }),
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log(data);
        //     //if there's an error
        //     if (data.error){
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
        //             books_to_remove: [],
        //         })
        //     }
        // })
    }

    if(Object.entries(state.user).length === 0){
        return false;
    }
    return (
            <ModalFormWithButton
                form_button={<DeleteShelfBadge handle_show={() => props.set_show_modal(true)}/>}
                title="Delete a Shelf in Your Library"
                handle_submit={handle_submit}
                handle_close={() => props.set_show_modal(false)}
                submit_button_text="Delete Shelf"
                submit_button_color="danger"
                show_modal={props.show_modal}
                error={props.error}
            >
                <ReactBootstrap.Modal.Body>
                    Warning: This will delete the shelf and remove all books from it. This action cannot be undone.
                </ReactBootstrap.Modal.Body>
            </ModalFormWithButton>
    )
}