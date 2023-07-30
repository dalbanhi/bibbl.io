// ReactBootstrap.Modal ideas from: https://react-bootstrap.netlify.app/docs/components/ReactBootstrap.Modal/
// ideas for multi select using react bootstrap: https://stackoverflow.com/questions/54573926/how-to-use-multi-select-dropdown-in-react-bootstrap

const AddShelf = (props) => {
    const [state, setState] = React.useState({
        user: {},
        show_modal: false,
        shelf_name: '',
        books_read_selected: [],
        books_reading_selected: [],
        books_to_read_selected: [],
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
        // e => setField([].slice.call(e.target.selectedOptions).map(item => item.value))
        console.log(event.target.selectedOptions);
        console.log(typeof(event.target.selectedOptions));

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
        console.log("submit");
    }

    // const handle_submit = (event) => {
    //     console.log("submit");
    //     event.preventDefault();
    //     console.log(props.add_book_url)

    //     fetch(props.add_book_url, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'X-CSRFToken': Cookies.get('csrftoken'),
    //         },
    //         body: JSON.stringify({
    //             title: state.book_title,
    //             authors: state.book_authors,
    //             publication_year: state.book_publication_year,
    //             cover_image_url: state.book_cover_image_url,
    //             read_category: state.book_read_category,
    //             user: state.user.id,
    //         })
    //     })
    //     .then(response => response.json())
    //     .then(data => {

    //         if (data.error){
    //             setState({
    //                 ...state,
    //                 error: data.error,
    //             })
    //         }
    //         else{
    //             //if not error, tell app to show message, update state, and close modal
    //             // props.update_book_list(data.book);
    //             props.set_success_message(data.message);
    //             setState({
    //                 ...state,
    //                 book_title: '',
    //                 book_authors: '',
    //                 book_publication_year: '',
    //                 book_cover_image_url: '',
    //                 book_read_category: 'read',
    //                 error:'',
    //                 show_modal: false,
    //             })
    //         }
    //     })
    // }

    if(Object.entries(state.user).length === 0){
        return false;
    }
    return (
        <div>
            {console.log(state)}
            <ReactBootstrap.Button
                variant="outline-primary"
                onClick={handle_show}
            >           
                <i className="bi bi-bookshelf">{` `}</i>
                Add Shelf
            </ReactBootstrap.Button>
            
            <ReactBootstrap.Modal show={state.show_modal} onHide={handle_close}>
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
                        
                        <ReactBootstrap.Form.Group className="mb-3" controlId="user_books_read">
                            <ReactBootstrap.Form.Label>Your Read Books</ReactBootstrap.Form.Label>
                            <ReactBootstrap.Form.Control as="select" name="books_read_selected" multiple value={state.books_read_selected} onChange={handle_select_change}>
                                {state.user.books_read.map((book) => {
                                    return (
                                        <option 
                                        key={book.id} 
                                        value={book.id}>{`${book.title} by ${book.main_author}`}</option>
                                    )
                                })}
                            </ReactBootstrap.Form.Control>
                        </ReactBootstrap.Form.Group>
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