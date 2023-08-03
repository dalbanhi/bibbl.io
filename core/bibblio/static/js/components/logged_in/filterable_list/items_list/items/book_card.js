const BookCard = (props) => {

    const category_mappings = {
        'read': {
            name: 'Read',
            bg: 'dark',
            value: 'books_read',
        },
        "reading": {
            name: 'Reading',
            bg: 'success',
            value: 'books_reading',
        },
        "to_read": {
            name: 'To Read',
            bg: 'info',
            value: 'books_to_read',
        },           
    };

    const [state, useState] = React.useState({
        book: {},
        user:{},
        book_shelves: [],
        which_category: '',
    })

    React.useEffect(() => {
        //update state on props change
        useState({
            ...state,
            book: props.book,
            user: props.user,
            //filter shelves to only those that the book is in
            book_shelves: props.user.shelves.filter((shelf) => {
                return props.book.in_shelves.includes(shelf.id);
            }),
            //set which category the book is in
            which_category: props.book.in_read.includes(props.user.id) ? 'read' : props.book.in_reading.includes(props.user.id) ? 'reading' : 'to_read',
        })
    }, [props])

    const edit_book = () => {
        console.log("edit book");
    }

    const remove_book_from_library = () => {
        console.log("remove book from library");
    }

    if(Object.keys(state.book).length === 0){
        return false;
    }
    return (
        <ReactBootstrap.Card>
            <ReactBootstrap.Card.Img variant="top" src={state.book.cover_image_url} />
                <ReactBootstrap.Card.Title>{state.book.title}</ReactBootstrap.Card.Title>
            <ReactBootstrap.Card.Body>
                <ReactBootstrap.Card.Text>
                    by {state.book.main_author}
                </ReactBootstrap.Card.Text>
                <ReactBootstrap.ListGroup className="list-group-flush">
                    <ReactBootstrap.ListGroup.Item>
                        Publication Year: {state.book.publication_year}
                    </ReactBootstrap.ListGroup.Item>
                    <ReactBootstrap.ListGroup.Item>
                        Your Shelves: {
                            //return a badge per shelf
                            state.book_shelves.map((shelf) => {
                                return(
                                    <ClickableBadge
                                        key={shelf.id}
                                        bg="secondary"
                                        name={shelf.name}
                                        onClick={props.on_shelf_change}
                                        value={shelf.id}
                                    />
                                )
                            })
                        }
                    </ReactBootstrap.ListGroup.Item>
                    <ReactBootstrap.ListGroup.Item>
                        Current Category:
                        <ClickableBadge
                            onClick={props.on_category_change}
                            bg= {category_mappings[state.which_category].bg}
                            name={category_mappings[state.which_category].name}
                            value={category_mappings[state.which_category].value}
                        />
                    </ReactBootstrap.ListGroup.Item>
                    <ReactBootstrap.ListGroup.Item>
                        <ClickableBadge
                            onClick={edit_book}
                            bg="warning"
                            name="Edit"
                        />
                        <ClickableBadge
                            onClick={remove_book_from_library}
                            bg="danger"
                            name="Remove from Library"
                        />                        
                    </ReactBootstrap.ListGroup.Item>
                </ReactBootstrap.ListGroup>
            </ReactBootstrap.Card.Body>
        </ReactBootstrap.Card>
    )
}