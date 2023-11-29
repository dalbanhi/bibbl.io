import React from "react";
import Button from "react-bootstrap/Button";



/**
 * A stylized button to be passed to ModalFormWithButton
 * @param {function} props.handle_show - function to show modal 
 * @param {string} props.button_text - text to display on button
 * @param {string} props.icon - icon to display on button
 * @returns {object} - ReactBootstrap.Button
 */
const OpenFormButton = (props) => {
    return (
      <Button
        variant="outline-primary"
        onClick={props.handle_show}
      >
        <i className={props.icon}>{` `}</i>
        {props.button_text}
      </Button>
    );
  };

  export default OpenFormButton;