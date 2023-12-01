import React from "react";
import { Badge } from "react-bootstrap";

// bg="warning"
// onClick={props.handle_show}
// name="Remove Books from Shelf"

/**
 * 
 * @param {object} props - received from parent
 * @param {string} props.bg - background color
 * //TODO: 
 * @param {function} props.on_click - function to handle click
 * @param {string} props.name - name of badge
 * @param {string} props.value - value of badge
 * @param {string} props.text - text color (unused)
 * @returns 
 */
const ClickableBadge = (props) => {
    return (
      <Badge
        pill
        className="mx-1"
        as="button"
        bg={props.bg}
        onClick={props.on_click}
        value={props.value}
        text={props.bg === "light" ? "dark" : "light"}
      >
        {props.name}
      </Badge>
    );
  };
export default ClickableBadge;