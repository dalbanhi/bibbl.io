const TextControls = (props) => {

    const [state, setState] = React.useState({
        form_name: '',
        fields: [],
        parent_state: {},
    });

    React.useEffect(() => {
        //update state on props load
        if(Object.entries(props.parent_state).length !== 0){
            setState({
                ...state,
                form_name: props.form_name,
                fields: props.fields,
                parent_state: props.parent_state,

            })
        }

    }, [props]);

    if(state.form_name === ''){
        return false;
    }
    return (
        <ReactBootstrap.Form.Group>
            {
                //for each field (in order, excluding radio button and shelf)
                state.fields.map((field, index) => {
                    //render a form group with a label and input
                    return(
                        <ReactBootstrap.Form.Group className="mb-3" controlId={`${state.form_name}.${field}`} key={index}>
                            <ReactBootstrap.Form.Label>{props.capitalize_names(field)}</ReactBootstrap.Form.Label>
                            <ReactBootstrap.Form.Control
                                type="text"
                                name={field}
                                placeholder={props.capitalize_names(field)}
                                defaultValue={state.parent_state[field]}
                                onChange={props.handle_input_change}
                                autoFocus={index === 0}
                            />
                        </ReactBootstrap.Form.Group>
                    )
                })
            }
        </ReactBootstrap.Form.Group>
    )
}
