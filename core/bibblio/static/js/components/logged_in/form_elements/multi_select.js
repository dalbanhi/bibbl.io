const MultiSelect = (props) => {
    //props:
    // control id
    // name
    // label
    // form control value (array)
    // handle change (function)
    // items to display (array of objects)
    // item type (book or shelf for formatting purposes)

    const [state, setState] = React.useState({
        control_id: '',
        label: '',
        name: '',
        value: [],
        handle_change: null,
        items_to_display: [],
        item_type: '',
    })

    React.useEffect(() => {
        // console.log("component loaded")
        //update state on props load
        if(Object.entries(props).length !== 0){
            // console.log("props loaded")
            setState({
                ...state,
                control_id: props.control_id,
                label: props.label,
                name: props.name,
                value: props.value,
                items_to_display: props.items_to_display,
                handle_change: props.handle_change,
                item_type: props.item_type,
            })
        }

    }, [props])

    const format_item_string = (item) => {
        if(state.item_type === 'book'){
            // console.log("here")
            return `${item.title} by ${item.main_author}`
        }
        else if(state.item_type === 'shelf'){
            return `${item.name} (${item.book_count} books)`
        }
    }


    //if props has not loaded yet, return false
    if(Object.entries(state.item_type).length === 0){
        // console.log("props not loaded yet")
        return false;
    }
    return (
        <ReactBootstrap.Form.Group
            className="mb-3" 
            controlId={state.control_id}>
                {console.log(state)}
                <ReactBootstrap.Form.Label>{state.label}</ReactBootstrap.Form.Label>
                <ReactBootstrap.Form.Control 
                    as="select"
                    multiple
                    name={state.name}
                    value={state.value}
                    onChange={state.handle_change}
                >
                    {/* an option element for each item in the multi-select*/}
                    {
                        state.items_to_display.map((item) => {
                            return(
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {format_item_string(item)}
                                </option>
                            )
                        })
                    }
                    {/* {state.user.shelves.map((shelf) => {
                                    return (
                                        <option 
                                            key={shelf.id}
                                            value={shelf.id}>{`${shelf.name} (${shelf.book_count} books)`}
                                        </option>
                                    )
                                })} */}
                </ReactBootstrap.Form.Control>
        {/* {console.log(state)} */}
        </ReactBootstrap.Form.Group>
    )
}