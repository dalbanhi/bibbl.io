const MultiSelectGroup = (props) => {

    const [state, setState] = React.useState({
        parent_state: {},
        fields: [],
    })

    React.useEffect(() => {
        //update state on props change
        setState({
            ...state,
            parent_state: props.parent_state,
            fields: props.fields,
        })

    },[props])

    if(Object.keys(state.parent_state).length === 0){
        return false;
    }
    return (
        <div>
            {console.log(state)}
            <ReactBootstrap.Form.Group>
            {
                state.fields.map((key, index) => {
                    //looping through user object, looking for keys that start with "books_"
                    // if(key.startsWith("books_")){
                        //a select for each book category
                        return(
                            <MultiSelect
                                key={key}
                                control_id={`user_${key}`}
                                label={props.capitalize_names(key)}
                                name={`${key}`}
                                value={state.parent_state[key]}
                                handle_change={props.handle_select_change}
                                items_to_display={state.parent_state.user[key]}
                                item_type="book"
                            />
                        )
                    // }
                })
            }

            </ReactBootstrap.Form.Group>
        </div>
    )
}