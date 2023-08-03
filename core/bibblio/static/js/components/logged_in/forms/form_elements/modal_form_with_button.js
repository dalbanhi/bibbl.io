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
        console.log("props changed: ", props)

        setState({
            ...state,
            ShowButton: props.form_button,
            error: props.error,
            // show_modal: props.show_modal,
        });    
        
    }, [props]);
    const ShowButton = props.form_button;

    const handle_close = () => {
        setState({
            ...state,
            show_modal: false,
        })
    }

    const handle_show = () => {
        setState({
            ...state,
            show_modal: true,
        })
    }
    if(state.ShowButton === null){
        return false;
    }
    return (
        <div>
            <div onClick={handle_show}>
                <ShowButton/>
            </div>
            <ReactBootstrap.Modal show={state.show_modal} onHide={handle_close}>
                <ReactBootstrap.Modal.Header closeButton>
                    <ReactBootstrap.Modal.Title>{props.title}</ReactBootstrap.Modal.Title>
                </ReactBootstrap.Modal.Header>
                <ReactBootstrap.Modal.Body>
                    {state.error && <div className="alert alert-danger" role="alert">{state.error}</div>}
                
                    <ReactBootstrap.Form onSubmit={props.handle_submit}>
                        {props.children}
                        <ReactBootstrap.Modal.Footer>
                            <ReactBootstrap.Button variant="secondary" onClick={handle_close}>
                                Close
                            </ReactBootstrap.Button>
                            <ReactBootstrap.Button variant="primary" type="submit">
                                {props.submit_button_text}
                            </ReactBootstrap.Button>
                        </ReactBootstrap.Modal.Footer>
                    </ReactBootstrap.Form>
                </ReactBootstrap.Modal.Body>
            </ReactBootstrap.Modal>
            
        </div>
    )
}