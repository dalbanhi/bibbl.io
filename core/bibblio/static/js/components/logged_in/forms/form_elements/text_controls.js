/**
 * A part of a form, given some fields, renders a label and text input for each, passing them up to the parent state. Used by form instances. 
 * @param {object} props - props passed from parent component
 * @param {string} props.form_name - the name of the form
 * @param {array} props.fields - the fields to be displayed as options to be edited
 * @param {object} props.parent_state - the state of the parent component
 * @param {object} props.current_object - the object being edited (if the form is being used to edit an object)
 * @param {boolean} props.has_previous_values -  boolean indicating whether the form has previous values to display
 * @param {function} props.capitalize_names - function to capitalize the names of the fields into nice format
 * @param {function} props.handle_input_change - function to handle input change
 * @returns 
 */
const TextControls = (props) => {
  const [state, setState] = React.useState({
    form_name: "",
    fields: [],
    parent_state: {},
    current_object: {},
  });

  React.useEffect(() => {
    //update state on props load
    if (Object.entries(props.parent_state).length !== 0) {
      setState({
        ...state,
        form_name: props.form_name,
        fields: props.fields,
        parent_state: props.parent_state,
        current_object: props.current_object,
      });
    }
  }, [props]);

  const format_field = (field) => {
    //if it is an array (aka is multiple authors, format multiple authors nicely)
    if (Array.isArray(field)) {
      //join the array with commas
      return <span>{field.join(",")}</span>;
    } else {
      if (String(field).startsWith("http")) {
        return <a href={field}>Link</a>;
      } else {
        return <span>{field}</span>;
      }
    }
  };

  if (state.form_name === "") {
    return false;
  }
  return (
    <ReactBootstrap.Form.Group>
      {
        //for each field (in order, excluding radio button and shelf)
        state.fields.map((field, index) => {
          //render a form group with a label and input
          return (
            <ReactBootstrap.Form.Group
              className="mb-3"
              controlId={`${state.form_name}.${field}`}
              key={index}
            >
              <ReactBootstrap.Form.Label>
                {props.capitalize_names(field)}
              </ReactBootstrap.Form.Label>
              {props.has_previous_values && (
                <p className="break-word">
                  {" "}
                  <em>
                    Currently: {format_field(state.current_object[field])}
                    {/* {String(state.current_object[field]).startsWith("http") ? <a href={state.current_object[field]}>Link</a>: state.current_object[field]} */}
                  </em>
                </p>
              )}
              <ReactBootstrap.Form.Control
                type="text"
                name={field}
                placeholder={props.capitalize_names(field)}
                defaultValue={state.parent_state[field]}
                onChange={props.handle_input_change}
                autoFocus={index === 0}
              />
            </ReactBootstrap.Form.Group>
          );
        })
      }
    </ReactBootstrap.Form.Group>
  );
};
