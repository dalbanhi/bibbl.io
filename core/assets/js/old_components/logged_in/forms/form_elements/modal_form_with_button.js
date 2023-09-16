//figured out the need and implementation for this abstraction here:
// https://stackoverflow.com/questions/39652686/pass-react-component-as-props

/**
 * A modal form with a button that opens the modal; receives children from form instances and renders them in the modal.
 * 
 * @param {*} props - props passed from parent component
 * @param {React.Component} props.form_button - the button that opens the modal
 * @param {string} props.title - the title of the modal
 * @param {function} props.handle_submit - the function to run when the form is submitted
 * @param {function} props.handle_close - the function to run when the modal is closed
 * @param {string} props.submit_button_text - the text to display on the submit button
 * @param {string} props.submit_button_color - the color of the submit button
 * @param {boolean} props.show_modal - whether or not to show the modal
 * @param {string} props.error - the error message to display
 * @returns 
 */
const ModalFormWithButton = (props) => {
  const [state, setState] = React.useState({
    show_modal: false,
    ShowButton: null,
    error: "",
  });

  React.useEffect(() => {
    //update state on props load


    setState({
      ...state,
      ShowButton: props.form_button,
      error: props.error,
      show_modal: props.show_modal,
    });
  }, [props]);

  if (state.ShowButton === null) {
    return false;
  }
  return (
    <div>
      {props.form_button}
      <ReactBootstrap.Modal show={props.show_modal} onHide={props.handle_close}>
        <ReactBootstrap.Modal.Header closeButton>
          <ReactBootstrap.Modal.Title>{props.title}</ReactBootstrap.Modal.Title>
        </ReactBootstrap.Modal.Header>
        <ReactBootstrap.Modal.Body>
          {props.error && (
            <div className="alert alert-danger" role="alert">
              {props.error}
            </div>
          )}

          <ReactBootstrap.Form onSubmit={props.handle_submit}>
            {props.children}
            <ReactBootstrap.Modal.Footer>
              <ReactBootstrap.Button
                variant="secondary"
                onClick={props.handle_close}
              >
                Close
              </ReactBootstrap.Button>
              <ReactBootstrap.Button
                variant={props.submit_button_color}
                type="submit"
              >
                {props.submit_button_text}
              </ReactBootstrap.Button>
            </ReactBootstrap.Modal.Footer>
          </ReactBootstrap.Form>
        </ReactBootstrap.Modal.Body>
      </ReactBootstrap.Modal>
    </div>
  );
};
