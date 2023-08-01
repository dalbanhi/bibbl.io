const AddBookToShelf = (props) => {

    const [state, setState] = React.useState({
        user: {},
        show_modal: false,
        fullscreen: true,
        error: '',
        books_read: [],
        books_reading: [],
        books_to_read: [],
        shelves: [],
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

    const handle_select_change = (event) => {
        let selected_items = [].slice.call(event.target.selectedOptions).map(item => item.value);
        setState({
            ...state,
            [event.target.name]: selected_items,
        });
    }

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
        console.log("submitting form");
        event.preventDefault();

        //try to add book(s) to shelf(s)
        fetch(props.add_book_to_shelf_url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({
                books_read: state.books_read,
                books_reading: state.books_reading,
                books_to_read: state.books_to_read,
                shelves: state.shelves,
                add_or_remove: "add",
            }),

        })
        .then(response => response.json())
        .then( data => {
            console.log(data);

            //if there's an error
            if(data.error){
                setState({
                    ...state,
                    error: data.error,
                })
            }
            else{
                //if no error, update user
                //props.update_user(data.user);
                setState({
                    ...state,
                    // user: data.user,
                    show_modal: false,
                    error: '',
                    books_read: [],
                    books_reading: [],
                    books_to_read: [],
                    shelves: [],
                })
                // props.update_user(data.user);
            }
        })
    }

    const capitalize_name = (name) => {
        const arr = name.split("_");
        for (let i = 0; i < arr.length; i++){
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        return arr.join(" ");
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
                Add Book(s) to Shelf
            </ReactBootstrap.Button>
            <ReactBootstrap.Modal fullscreen={state.fullscreen} show={state.show_modal} onHide={handle_close}>
                <ReactBootstrap.Modal.Header closeButton>
                    <ReactBootstrap.Modal.Title>Add books(s) to shelf (or shelves)</ReactBootstrap.Modal.Title>
                </ReactBootstrap.Modal.Header>
                <ReactBootstrap.Modal.Body>
                    {   
                        //show error
                        state.error && <div className="alert alert-danger" role="alert">{state.error}</div>
                    }
                    <ReactBootstrap.Form onSubmit={handle_submit}>
                        <ReactBootstrap.Form.Label>
                            <p>If you don't see any books, add some to your library first!</p>
                            <p><small>To select multiple books, hold the ctrl button (Windows) or the cmd button (macOS).</small></p>
                        </ReactBootstrap.Form.Label>
                        {
                            Object.keys(state.user).map((key, index) => {
                                //looping through user object, looking for keys that start with "books_"
                                if(key.startsWith("books_")){
                                    //a select for each book category
                                    return(
                                        <MultiSelect
                                            key={key}
                                            control_id={`user_${key}`}
                                            label={capitalize_name(key)}
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
                        {/* multi select for Shelf */}
                        <MultiSelect
                            control_id="add_book_form.shelf"
                            label="Shelves to add to: (all books selected will be added to all selected shelves). Repeats are ignored."
                            name="shelves"
                            value={state.shelves}
                            handle_change={handle_select_change}
                            items_to_display={state.user.shelves}
                            item_type="shelf"
                        />
                        <ReactBootstrap.Modal.Footer>
                            <ReactBootstrap.Button variant="secondary" onClick={handle_close}>
                                Close
                            </ReactBootstrap.Button>
                            <ReactBootstrap.Button variant="primary" type="submit">
                                Add Book(s) to Shelf!
                            </ReactBootstrap.Button>
                        </ReactBootstrap.Modal.Footer>
                    </ReactBootstrap.Form>
                </ReactBootstrap.Modal.Body>
            </ReactBootstrap.Modal>
        </div>
    )
}