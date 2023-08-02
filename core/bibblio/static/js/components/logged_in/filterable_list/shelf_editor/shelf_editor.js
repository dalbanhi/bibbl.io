const ShelfEditor = (props) => {
 
    const [state, setState] = React.useState({
        user: {},
    });

    React.useEffect(() => {
        //update state on props load
        if(Object.entries(props.user).length !== 0){
            setState({
                ...state,
                user: props.user,
            })
        }
    }, [props]);

    const get_shelf_name = () => {
        const shelf = state.user.shelves.find((shelf) => shelf.id === props.shelf_id);
        return shelf.name;
    }

    const handle_shelf_edit = (user, shelf_name) => {
        console.log("handle_shelf_edit");

    }

    const handle_shelf_delete = (user, shelf_name) => {
        console.log("handle_shelf_delete");

    }

    if(Object.entries(state.user).length === 0){
        return false;
    }
    return (
        <div className="m-2">
            <h4>Shelf Editor for: {get_shelf_name()}</h4>
            <ClickableBadge
                bg="warning"
                onClick={() => handle_shelf_edit(state.user, props.shelf_name)}
                value={props.shelf_id}
                name="Edit Shelf"
            />
            <ClickableBadge
                bg="danger"
                onClick={() => handle_shelf_delete(state.user, props.shelf_name)}
                value={props.shelf_id}
                name="Delete Shelf"
            />
            
        </div>
    )
}
