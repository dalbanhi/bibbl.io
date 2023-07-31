// ReactBootstrap.Modal ideas from: https://react-bootstrap.netlify.app/docs/components/ReactBootstrap.Modal/
// React Bootstrap Checkboxhttps://react-bootstrap.netlify.app/docs/forms/checks-radios

const AddBook = (props) => {
    const [state, setState] = React.useState({
        user: {},
        show_modal: false,
        //order in which form will be displayed
        form_order: ['book_title', 'book_authors', 'book_publication_year', 'book_cover_image_url'],
        book_title: '',
        book_authors: '',
        book_publication_year: '',
        book_cover_image_url: '',
        book_read_category: 'read',
        shelves: [],
        error:'',
        fullscreen: true,
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
        event.preventDefault();

        fetch(props.add_book_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({
                title: state.book_title,
                authors: state.book_authors,
                publication_year: state.book_publication_year,
                cover_image_url: state.book_cover_image_url,
                read_category: state.book_read_category,
                shelves: state.shelves,
                user: state.user.id,
            })
        })
        .then(response => response.json())
        .then(data => {

            if (data.error){
                setState({
                    ...state,
                    error: data.error,
                })
            }
            else{
                //if not error, tell app to show message, update state, and close modal
                // props.update_book_list(data.book);
                props.set_success_message(data.message);
                setState({
                    ...state,
                    book_title: '',
                    book_authors: '',
                    book_publication_year: '',
                    book_cover_image_url: '',
                    book_read_category: 'read',
                    error:'',
                    shelves: [],
                    show_modal: false,
                })
            }
        })
    }

    const handle_select_change = (event) => {
        let selected_items = [].slice.call(event.target.selectedOptions).map(item => item.value);
        setState({
            ...state,
            [event.target.name]: selected_items,
        });
    }

    const book_field_titles = (field) => {
        //capitalize each word and replace underscores with spaces
        field = field.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        return field;
    }

    const book_read_category_titles = (category) => {
        category = category.replace("books_", "").replace("_", " ");
        //capitalize
        category = category.charAt(0).toUpperCase() + category.slice(1);
        return category;
    }

    if(Object.entries(state.user).length === 0){
        return false;
    }
    return (
        <div>
            <ReactBootstrap.Button
                variant="outline-primary"
                onClick={handle_show}
            >           
                <i className="bi bi-book">{` `}</i>
                Add Book
            </ReactBootstrap.Button>
            
            <ReactBootstrap.Modal fullscreen={state.fullscreen} show={state.show_modal} onHide={handle_close}>
                <ReactBootstrap.Modal.Header closeButton>
                    <ReactBootstrap.Modal.Title>Add a Book to Your Library</ReactBootstrap.Modal.Title>
                </ReactBootstrap.Modal.Header>
                <ReactBootstrap.Modal.Body>
                    {state.error && <div className="alert alert-danger" role="alert">{state.error}</div>}
                    
                    <ReactBootstrap.Form onSubmit={handle_submit}>
                        {
                            //for each field (in order, excluding radio button and shelf)
                            state.form_order.map((field, index) => {
                                //render a form group with a label and input
                                return(
                                    <ReactBootstrap.Form.Group className="mb-3" controlId={`add_book_form.${field}`} key={index}>
                                        <ReactBootstrap.Form.Label>{book_field_titles(field)}</ReactBootstrap.Form.Label>
                                        <ReactBootstrap.Form.Control
                                            type="text"
                                            name={field}
                                            placeholder={book_field_titles(field)}
                                            defaultValue={state[field]}
                                            onChange={handle_input_change}
                                            autoFocus={index === 0}
                                        />
                                    </ReactBootstrap.Form.Group>
                                )
                            })
                            
                        }
                        {/* radio button for read category */}
                        <ReactBootstrap.Form.Group className="mb-3" controlId="add_book_form.read_category">
                            <ReactBootstrap.Form.Label>Category</ReactBootstrap.Form.Label>
                            <br />
                            {
                                Object.keys(state.user).map((key, index) => {
                                    //for reach key that starts with "books_", create a radio button
                                    if(key.startsWith("books_")){
                                        return(
                                            <ReactBootstrap.Form.Check
                                                key={key}
                                                inline
                                                label={book_read_category_titles(key)}
                                                name="book_read_category"
                                                type="radio"
                                                id={`inline-radio-1`}
                                                value={key.replace("books_", "")}
                                                checked={state.book_read_category === key.replace("books_", "")}
                                                onChange={handle_input_change}
                                            />
                                        )
                                    }
                                })
                            }
                        </ReactBootstrap.Form.Group>
                        {/* multi select for Shelf */}
                        <ReactBootstrap.Form.Group className="mb-3" controlId="add_book_form.shelf">
                            <ReactBootstrap.Form.Label>
                                Add this Book to your Shelves
                                <br/>
                                <small>If you don't see any shelves, add some to your library first!</small>
                                <br/>
                                <small>Hold down the ctrl/cmd key to select multiple shelves</small>
                            </ReactBootstrap.Form.Label>
                            <ReactBootstrap.Form.Control as="select" name="shelves" multiple value={state.shelves} onChange={handle_select_change}>
                                {/* an option element for each shelf in the user shelves*/}
                                {state.user.shelves.map((shelf) => {
                                    return (
                                        <option 
                                            key={shelf.id}
                                            value={shelf.id}>{`${shelf.name} (${shelf.book_count} books)`}
                                        </option>
                                    )
                                })}
                            </ReactBootstrap.Form.Control>
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