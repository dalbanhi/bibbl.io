import React from "react";
import Form from "react-bootstrap/Form";

import MultiSelectInstructions from "./multiSelectInstructions";

/**
 * A part of a form, a multi-select element that updates the parent state. Used by form instances. 
 * @param {object} props - props passed from parent component
 * @param {string} props.form_name - name of the form
 * @param {string} props.label - label for the multi-select
 * @param {string} props.name - name for the multi-select
 * @param {array} props.value - value for the multi-select
 * @param {function} props.handle_change - function to handle change in multi-select
 * @param {array} props.items_to_display - items to display in the multi-select
 * @param {string} props.item_type - type of item in the multi-select
 * @param {boolean} props.show_instructions - whether to show instructions for the multi-select
 * @returns 
 */
const MultiSelect = (props) => {
    const [state, setState] = React.useState({
      control_id: "",
      label: "",
      name: "",
      value: [],
      handle_change: null,
      items_to_display: [],
      item_type: "",
      show_instructions: false,
    });
  
    React.useEffect(() => {
      //update state on props load
      if (Object.entries(props).length !== 0) {
        setState({
          ...state,
          control_id: props.control_id,
          label: props.label,
          name: props.name,
          value: props.value,
          items_to_display: props.items_to_display,
          handle_change: props.handle_change,
          item_type: props.item_type,
          show_instructions: props.show_instructions,
        });
      }
    }, [props]);
  
    const format_item_string = (item) => {
      if (state.item_type === "book") {
        return `${item.title} by ${item.main_author}`;
      } else if (state.item_type === "shelf") {
        return `${item.name} (${item.book_count} books)`;
      }
    };
    //if props has not loaded yet, return false
    if (Object.entries(state.item_type).length === 0) {
      return false;
    }
    return (
      <Form.Group className="mb-3" controlId={state.control_id}>
        <Form.Label>{state.label}</Form.Label>
        {state.show_instructions === true ? <MultiSelectInstructions /> : null}
        <Form.Control
          as="select"
          multiple
          name={state.name}
          value={state.value}
          onChange={state.handle_change}
        >
          {/* an option element for each item in the multi-select*/}
          {state.items_to_display.map((item) => {
            return (
              <option key={item.id} value={item.id}>
                {format_item_string(item)}
              </option>
            );
          })}
        </Form.Control>
      </Form.Group>
    );
  };

  export default MultiSelect;
  