// ReactBootstrap.Modal ideas from: https://react-bootstrap.netlify.app/docs/components/ReactBootstrap.Modal/
// ideas for multi select using react bootstrap: https://stackoverflow.com/questions/54573926/how-to-use-multi-select-dropdown-in-react-bootstrap

const AddShelf = (props) => {
    const [state, setState] = React.useState({
        user: {},
        show_modal: false,
        shelf_name: '',
        books_read: [],
        books_reading: [],
        books_to_read: [],
        error:'',
    })

    React.useEffect(() => {
        //update state on props load
        if(Object.entries(props.user).length !== 0){
            setState({
                ...state,
                user: props.user,
            })
        }
    }, [props])

    const handle_show = () => {
        setState({
            ...state,
            show_modal: true,
        })
    }

    const handle_input_change = (event) => {
        setState({
            ...state,
            [event.target.name]: event.currentTarget.value,
        })
    }

    const handle_select_change = (event) => {
        console.log("handle slec change")
        let selected_items = [].slice.call(event.target.selectedOptions).map(item => item.value);
        setState({
            ...state,
            [event.target.name]: selected_items,
        });
    }

    const handle_close = () => {
        setState({
            ...state,
            show_modal: false,
        })
    }
    const handle_submit = (event) => {
        event.preventDefault();

        //try to add shelf
        fetch(props.add_shelf_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({
                name: state.shelf_name,
                books_read: state.books_read,
                books_reading: state.books_reading,
                books_to_read: state.books_to_read,
                user: state.user.id,
            })
        })
        .then(response => response.json())
        .then(data => {
            //if there's an error
            if (data.error){
                setState({
                    ...state,
                    error: data.error,
                })
            }
            //if there's no error
            else{
                //tell app to show message update state, clear form, close modal
                props.set_success_message(data.message);
                props.update_user(data.user);
                setState({
                    ...state,
                    show_modal: false,
                    shelf_name: '',
                    books_read: [],
                    books_reading: [],
                    books_to_read: [],
                    error:'',
                });

            }
        })
    }

    const capitalize_names = (field_name) => {
        field_name = field_name.replace("book_", "").replace("books_", "").replace("_", " ");

        //capitalize each word and replace underscores with spaces
        field_name = field_name.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        return field_name;
    }

    if(Object.entries(state.user).length === 0){
        return false;
    }
    return (
        <div>
            {/* {console.log(state)} */}
            <ReactBootstrap.Button
                variant="outline-primary"
                onClick={handle_show}
            >           
                <i className="bi bi-bookshelf">{` `}</i>
                Add Shelf
            </ReactBootstrap.Button>
            <ReactBootstrap.Modal fullscreen={state.fullscreen} show={state.show_modal} onHide={handle_close}>
                <ReactBootstrap.Modal.Header closeButton>
                    <ReactBootstrap.Modal.Title>Add a Shelf to Your Library</ReactBootstrap.Modal.Title>
                </ReactBootstrap.Modal.Header>
                <ReactBootstrap.Modal.Body>
                    {state.error && <div className="alert alert-danger" role="alert">{state.error}</div>}
                    <ReactBootstrap.Form onSubmit={handle_submit}>
                        <ReactBootstrap.Form.Group className="mb-3" controlId="add_book_form.title">
                            <ReactBootstrap.Form.Label>Shelf Name</ReactBootstrap.Form.Label>
                            <ReactBootstrap.Form.Control
                                type="text"
                                name="shelf_name"
                                placeholder="Shelf Name"
                                defaultValue={state.shelf_name}
                                onChange={handle_input_change}
                                autoFocus
                            />
                        </ReactBootstrap.Form.Group>
                        <hr></hr>
                        <ReactBootstrap.Form.Label>Add some books to this shelf (optional)!</ReactBootstrap.Form.Label>
                        <p>If you don't see any books, add some to your library first!</p>
                        <p><small>To select multiple books, hold the ctrl button (Windows) or the cmd button (macOS).</small></p>

                        {
                            Object.keys(state.user).map((key, index) => {
                                //looping through user object, looking for keys that start with "books_"
                                if(key.startsWith("books_")){
                                    //a select for each book category
                                    return(
                                        <MultiSelect
                                            key={key}
                                            control_id={`user_${key}`}
                                            label={capitalize_names(key)}
                                            name={`${key}`}
                                            value={state[key]}
                                            handle_change={handle_select_change}
                                            items_to_display={state.user[key]}
                                            item_type="book"
                                        />
                                    )
                                }
                            })
                        }
                        <ReactBootstrap.Modal.Footer>
                            <ReactBootstrap.Button variant="secondary" onClick={handle_close}>
                                Close
                            </ReactBootstrap.Button>
                            <ReactBootstrap.Button variant="primary" type="submit">
                                Add Shelf!
                            </ReactBootstrap.Button>
                        </ReactBootstrap.Modal.Footer>
                    </ReactBootstrap.Form>
                </ReactBootstrap.Modal.Body>
            </ReactBootstrap.Modal>
        </div>
    )
}