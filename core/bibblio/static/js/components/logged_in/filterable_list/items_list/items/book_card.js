const BookCard = (props) => {

    const [state, useState] = React.useState({
        book: {},
        user:{},
    })

    React.useEffect(() => {
        //update state on props change
        useState({
            ...state,
            book: props.book,
            user: props.user,
        })
    }, [props])

    const get_shelves = () => {
        let user_shelves = state.user.shelves;
        let book_shelves_ids = state.book.in_shelves;

        let book_shelves = user_shelves.filter((shelf) => {
            return book_shelves_ids.includes(shelf.id);
        })

        let shelf_badges = book_shelves.map((shelf) => {
            return(
                <ClickableBadge
                    key={shelf.id}
                    bg="secondary"
                    name={shelf.name}
                    onClick={props.on_shelf_change}
                    value={shelf.id}
                />
                // <ReactBootstrap.Badge 
                //     pill 
                //     bg="secondary" 
                //     key={shelf.id}
                // >
                //     {shelf.name}
                // </ReactBootstrap.Badge>
            )
        })
        return shelf_badges;
    }

    const get_category = () => {
        return(
            <ClickableBadge
                onClick={props.on_category_change}
                bg= {state.book.in_read.includes(state.user.id) ? "success" : state.book.in_reading.includes(state.user.id) ? "warning" : state.book.in_to_read.includes(state.user.id) ? "info" : "secondary"}
                name={state.book.in_read.includes(state.user.id) ? "Read" : state.book.in_reading.includes(state.user.id) ? "Reading" : state.book.in_to_read.includes(state.user.id) ? "To Read" : "None"}
            />
        )
        

        // if(book_user_read_ids.includes(state.user.id)){
        //     return(
        //         <ReactBootstrap.Badge 
        //             pill
        //             bg="success"
        //         >
        //             Read
        //         </ReactBootstrap.Badge>
        //     )
        // }
        // else if(book_user_reading_ids.includes(state.user.id)){
        //     return(
        //         <ReactBootstrap.Badge 
        //             pill 
        //             bg="warning"
        //         >
        //             Reading
        //         </ReactBootstrap.Badge>
        //     )
        // }
        // else if(book_user_to_read_ids.includes(state.user.id)){
        //     return(
        //         <ReactBootstrap.Badge 
        //             pill 
        //             bg="info"
        //         >
        //             To Read
        //         </ReactBootstrap.Badge>
        //     )
        // }
    }

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
                        Your Shelves: {get_shelves()}
                    </ReactBootstrap.ListGroup.Item>
                    <ReactBootstrap.ListGroup.Item>
                        Current Category:
                        <ClickableBadge
                            onClick={props.on_category_change}
                            bg= {state.book.in_read.includes(state.user.id) ? "success" : state.book.in_reading.includes(state.user.id) ? "warning" : state.book.in_to_read.includes(state.user.id) ? "info" : "secondary"}
                            name={state.book.in_read.includes(state.user.id) ? "Read" : state.book.in_reading.includes(state.user.id) ? "Reading" : state.book.in_to_read.includes(state.user.id) ? "To Read" : "None"}
                            value={state.book.in_read.includes(state.user.id) ? "books_read" : state.book.in_reading.includes(state.user.id) ? "books_reading" : state.book.in_to_read.includes(state.user.id) ? "books_to_read" : "none"}
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
                        {/* <ReactBootstrap.Badge
                            bg="warning"
                            onClick={edit_book}
                        >
                            Edit
                        </ReactBootstrap.Badge>
                        <ReactBootstrap.Badge
                            bg="danger"
                            onClick={remove_book_from_library}
                        >
                            Remove from Library
                        </ReactBootstrap.Badge> */}
                        
                    </ReactBootstrap.ListGroup.Item>
                </ReactBootstrap.ListGroup>
            </ReactBootstrap.Card.Body>
        </ReactBootstrap.Card>
    )
}