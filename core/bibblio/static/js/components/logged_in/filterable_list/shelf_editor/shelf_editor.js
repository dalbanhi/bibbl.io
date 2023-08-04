const ShelfEditor = (props) => {
 
    const [state, setState] = React.useState({
        user: {},
        shelf: {},
        message: "",
    });

    React.useEffect(() => {
        //update state on props load
        if(Object.entries(props.user).length !== 0){
            const shelf = props.user.shelves.find((shelf) => shelf.id === props.shelf_id);
            setState({
                ...state,
                user: props.user,
                shelf: shelf,
            })
        }
    }, [props]);

    const set_message = (message) => {
        setState({
            ...state,
            message: message,
        })
    }

    const clear_message = () => {
        set_message('');
    }

    const handle_shelf_delete = (user, shelf_name) => {
        console.log("handle_shelf_delete");

    }

    if(Object.entries(state.user).length === 0){
        return false;
    }
    return (
        <div className="m-2">
            <h4>Shelf Editor for: {state.shelf.name}</h4>
            {/* adding an alert message on form submissions */}
            {state.message && <div className="dissappearing-message alert alert-success" role="alert" onAnimationIteration={clear_message}>{state.message}</div>}
            <ModalFormBase
                user={state.user}
                render={(show_modal, set_show_modal, error, set_error, capitalize_names) => {
                    return(
                        <EditShelfForm
                            user={state.user}
                            shelf={state.shelf}
                            update_user={props.update_user}
                            set_success_message={set_message}
                            edit_shelf_url={props.shelf_url}
                            //render props
                            show_modal={show_modal}
                            set_show_modal={set_show_modal}
                            capitalize_names={capitalize_names}
                            error={error}
                            set_error={set_error}
                        />
                    )
                }} 
            />
            <ModalFormBase
                user={state.user}
                render={(show_modal, set_show_modal, error, set_error, capitalize_names) => {
                    return(
                        <DeleteShelfForm
                            user={state.user}
                            shelf={state.shelf}
                            update_user={props.update_user}
                            set_success_message={set_message}
                            edit_shelf_url={props.shelf_url}
                            //render props
                            show_modal={show_modal}
                            set_show_modal={set_show_modal}
                            capitalize_names={capitalize_names}
                            error={error}
                            set_error={set_error}
                        />
                    )
                }} 
            />
            <ClickableBadge
                bg="danger"
                onClick={() => handle_shelf_delete(state.user, props.shelf_name)}
                value={props.shelf_id}
                name="Delete"
            />
        </div>
    )
}
