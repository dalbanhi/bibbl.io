import React from "react";
import Form from "react-bootstrap/Form";

/**
 * A component to display a set of inline radios, used as part of a form instance
 * @param {object} props - passed in from parent component
 * @param {object} props.parent_state - parent's state to update
 * @param {function} props.handle_input_change - function to handle input changes
 * @param {function} props.capitalize_names - function to capitalize names
 * @param {array} props.fields - array of fields to display radios for
 * @param {string} props.form_name - name of form
 * @param {string} props.title - title of radios
 * @param {string} props.label - label for radios
 * @returns 
 */
const InlineRadios = (props) => {
    const [state, setState] = React.useState({
      parent_state: {},
      form_name: "",
      fields: [],
      title: "",
    });
  
    React.useEffect(() => {
      //update state on props load
      if (Object.entries(props.parent_state).length !== 0) {
        setState({
          ...state,
          form_name: props.form_name,
          fields: props.fields,
          parent_state: props.parent_state,
          title: props.title,
        });
      }
    }, [props]);
  
    return (
      <Form.Group
        className="mb-3"
        controlId={`${state.form_name}.${state.title}`}
      >
        <Form.Label>{props.label}</Form.Label>
        <br />
        {state.fields.map((field, index) => {
          return (
            <Form.Check
              key={index}
              inline
              label={props.capitalize_names(field)}
              name={state.title}
              type="radio"
              id={`inline-radio-${index}`}
              value={field.replace("books_", "")}
              checked={
                state.parent_state[state.title] === field.replace("books_", "")
              }
              onChange={props.handle_input_change}
            />
          );
        })}
      </Form.Group>
    );
  };

export default InlineRadios;