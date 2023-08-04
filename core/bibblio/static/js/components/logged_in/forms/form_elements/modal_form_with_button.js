//figured out the need and implementation for htis abstraction here:
// https://stackoverflow.com/questions/39652686/pass-react-component-as-props

const ModalFormWithButton = (props) => {

    const [state, setState] = React.useState({
        show_modal: false,
        ShowButton: null,
        error: ''
    });


    React.useEffect(() => {
        //update state on props load
        // console.log("props changed: ", props)

        setState({
            ...state,
            ShowButton: props.form_button,
            error: props.error,
            show_modal: props.show_modal,
        });    
        
    }, [props]);

    if(state.ShowButton === null){
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
                    {props.error && <div className="alert alert-danger" role="alert">{props.error}</div>}
                
                    <ReactBootstrap.Form onSubmit={props.handle_submit}>
                        {props.children}
                        <ReactBootstrap.Modal.Footer>
                            <ReactBootstrap.Button variant="secondary" onClick={props.handle_close}>
                                Close
                            </ReactBootstrap.Button>
                            <ReactBootstrap.Button variant={props.submit_button_color} type="submit">
                                {props.submit_button_text}
                            </ReactBootstrap.Button>
                        </ReactBootstrap.Modal.Footer>
                    </ReactBootstrap.Form>
                </ReactBootstrap.Modal.Body>
            </ReactBootstrap.Modal>
            
        </div>
    )
}