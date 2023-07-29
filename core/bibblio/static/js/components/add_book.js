// ReactBootstrap.Modal ideas from: https://react-bootstrap.netlify.app/docs/components/ReactBootstrap.Modal/
// React Bootstrap Checkboxhttps://react-bootstrap.netlify.app/docs/forms/checks-radios

const AddBook = (props) => {
    const [state, setState] = React.useState({
        user: {},
        show_modal: false,
        book_title: '',
        book_author: '',
        book_year_published: '',
        book_cover_image_url: '',
        book_read_category: 'read',
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

    const handle_close = () => {
        setState({
            ...state,
            show_modal: false,
        })
    }

    const handle_submit = (event) => {
        console.log("submit")
        event.preventDefault();
    }

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
                <i className="bi bi-book">{` `}</i>
                Add Book
            </ReactBootstrap.Button>
            <ReactBootstrap.Modal show={state.show_modal} onHide={handle_close}>
                <ReactBootstrap.Modal.Header closeButton>
                    <ReactBootstrap.Modal.Title>Add a Book to Your Library</ReactBootstrap.Modal.Title>
                </ReactBootstrap.Modal.Header>
                <ReactBootstrap.Modal.Body>
                    <ReactBootstrap.Form onSubmit={handle_submit}>
                        <ReactBootstrap.Form.Group className="mb-3" controlId="add_book_form.title">
                            <ReactBootstrap.Form.Label>Book Title</ReactBootstrap.Form.Label>
                            <ReactBootstrap.Form.Control
                                type="text"
                                name="book_title"
                                placeholder="Book Title"
                                defaultValue={state.book_title}
                                onChange={handle_input_change}
                                autoFocus
                            />
                        </ReactBootstrap.Form.Group>
                        <ReactBootstrap.Form.Group className="mb-3" controlId="add_book_form.author">
                            <ReactBootstrap.Form.Label>Author</ReactBootstrap.Form.Label>
                            <ReactBootstrap.Form.Control
                                type="text"
                                name="book_author"
                                placeholder="Author"
                                defaultValue={state.book_author}
                                onChange={handle_input_change}
                            />
                        </ReactBootstrap.Form.Group>
                        <ReactBootstrap.Form.Group className="mb-3" controlId="add_book_form.year_published">
                            <ReactBootstrap.Form.Label>Year Published</ReactBootstrap.Form.Label>
                            <ReactBootstrap.Form.Control
                                type="text"
                                name="book_year_published"
                                placeholder="Year Published"
                                defaultValue={state.book_year_published}
                                onChange={handle_input_change}
                                
                            />
                        </ReactBootstrap.Form.Group>
                        <ReactBootstrap.Form.Group className="mb-3" controlId="add_book_form.image_url">
                            <ReactBootstrap.Form.Label>Book Cover</ReactBootstrap.Form.Label>
                            <ReactBootstrap.Form.Control
                                type="text"
                                name="book_cover_image_url"
                                placeholder="url to book cover"
                                defaultValue={state.book_cover_image_url}
                                onChange={handle_input_change}
                                
                            />
                        </ReactBootstrap.Form.Group>
                        <ReactBootstrap.Form.Group className="mb-3" controlId="add_book_form.read_category">
                            <ReactBootstrap.Form.Label>Category</ReactBootstrap.Form.Label>
                            <br />
                            <ReactBootstrap.Form.Check
                                inline
                                label="Read"
                                name="book_read_category"
                                type="radio"
                                id={`inline-radio-1`}
                                value="read"
                                checked={state.book_read_category === "read"}
                                onChange={handle_input_change}
                            />
                            <ReactBootstrap.Form.Check
                                inline
                                label="To Read"
                                name="book_read_category"
                                type="radio"
                                id={`inline-radio-1`}
                                value="to_read"
                                checked={state.book_read_category === "to_read"}
                                onChange={handle_input_change}
                            />
                            <ReactBootstrap.Form.Check
                                inline
                                label="Reading"
                                name="book_read_category"
                                type="radio"
                                id={`inline-radio-1`}
                                value="reading"
                                checked={state.book_read_category === "reading"}
                                onChange={handle_input_change}
                            />
                        </ReactBootstrap.Form.Group>
                        <ReactBootstrap.Modal.Footer>
                            <ReactBootstrap.Button variant="secondary" onClick={handle_close}>
                                Close
                            </ReactBootstrap.Button>
                            <ReactBootstrap.Button variant="primary" type="submit">
                                Add Book!
                            </ReactBootstrap.Button>
                        </ReactBootstrap.Modal.Footer>
                        
                    </ReactBootstrap.Form>
                </ReactBootstrap.Modal.Body>
                
            </ReactBootstrap.Modal>
        </div>
        
    )
}