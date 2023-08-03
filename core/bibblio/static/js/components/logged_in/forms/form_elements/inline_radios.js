const InlineRadios = (props) => {

    const [state, setState] = React.useState({
        parent_state: {},
        form_name: '',
        fields: [],
        title: '',
    })

    React.useEffect(() => {
        //update state on props load
        if(Object.entries(props.parent_state).length !== 0){
            setState({
                ...state,
                form_name: props.form_name,
                fields: props.fields,
                parent_state: props.parent_state,
                title: props.title,

            })
        }

    }, [props]);

    return (
        <ReactBootstrap.Form.Group className="mb-3" controlId={`${state.form_name}.${state.title}`}>
            <ReactBootstrap.Form.Label>{props.capitalize_names(state.title)}</ReactBootstrap.Form.Label>
            <br />
            {
                state.fields.map((field, index) => {
                    return(
                        <ReactBootstrap.Form.Check
                            key={index}
                            inline
                            label={props.capitalize_names(field)}
                            name={state.title}
                            type="radio"
                            id={`inline-radio-${index}`}
                            value={field.replace("books_", "")}
                            checked={state.parent_state[state.title] === field.replace("books_", "")}
                            onChange={props.handle_input_change}
                        />
                    )
                })
            }

            {/* {
                Object.keys(state.user).map((key, index) => {
                    //for reach key that starts with "books_", create a radio button
                    if(key.startsWith("books_")){
                        return(
                            <ReactBootstrap.Form.Check
                                key={key}
                                inline
                                label={capitalize_names(key)}
                                name="book_read_category"
                                type="radio"
                                id={`inline-radio-1`}
                                value={key.replace("books_", "")}
                                checked={state.book_read_category === key.replace("books_", "")}
                                onChange={handle_input_change}
                            />
                        )
                    }
                })
            } */}
        </ReactBootstrap.Form.Group>
    )
}