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
            console.log(shelf)
            return(
                <ReactBootstrap.Badge pill bg="secondary" key={shelf.id}>{shelf.name}</ReactBootstrap.Badge>
            )
        })
        return shelf_badges;
    }

    const get_category = () => {
        let book_user_read_ids = state.book.in_read;
        let book_user_reading_ids = state.book.in_reading;
        let book_user_to_read_ids = state.book.in_to_read;

        if(book_user_read_ids.includes(state.user.id)){
            return(
                <ReactBootstrap.Badge pill bg="success">Read</ReactBootstrap.Badge>
            )
        }
        else if(book_user_reading_ids.includes(state.user.id)){
            return(
                <ReactBootstrap.Badge pill bg="warning">Reading</ReactBootstrap.Badge>
            )
        }
        else if(book_user_to_read_ids.includes(state.user.id)){
            return(
                <ReactBootstrap.Badge pill bg="info">To Read</ReactBootstrap.Badge>
            )
        }
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
                        Current Category: {get_category()}
                    </ReactBootstrap.ListGroup.Item>
                </ReactBootstrap.ListGroup>



            </ReactBootstrap.Card.Body>

        </ReactBootstrap.Card>
    )
}