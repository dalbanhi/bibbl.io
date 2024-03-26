import React from "react";
import MultiSelect from "./multiSelect";
import Form from "react-bootstrap/Form";

// parent_state={state}
// handle_select_change={handle_select_change}
// capitalize_names={props.capitalize_names}
// fields={Object.keys(state.user).filter((key) =>
//   key.startsWith("books_"),
// )}

/** 
 * Given a fields array, render a multi select for each field. For now, it is only used for books since there are only book types for now
 * @param {object} props -  props passed in from parent component (form)
 * @param {object} props.parent_state - parent's state to update
 * @param {function} props.handle_select_change - function to handle select changes
 * @param {function} props.capitalize_names - function to capitalize names
 * @param {array} props.fields - array of fields to display multi selects for
*/
const MultiSelectGroup = (props) => {
    const [state, setState] = React.useState({
      parent_state: {},
      fields: [],
    });
  
    React.useEffect(() => {
      //update state on props change
      setState({
        ...state,
        parent_state: props.parent_state,
        fields: props.fields,
      });
    }, [props]);
  
    if (Object.keys(state.parent_state).length === 0) {
      return false;
    }
    return (
      // <div>
      <Form.Group>
        {state.fields.map((key, index) => {
          return (
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
          );
        })}
      </Form.Group>
    );
  };

export default MultiSelectGroup;
  