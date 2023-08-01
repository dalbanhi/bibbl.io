// bootstrap icons: 
// book: https://icons.getbootstrap.com/icons/book/
// bookshelf: https://icons.getbootstrap.com/icons/bookshelf/
// bookmark: https://icons.getbootstrap.com/icons/bookmark/


const LoggedInView = (props) => {
    const [state, setState] = React.useState({
        view_title: '',
        user: {},
        api_urls: {},
        message: '',
    })

    React.useEffect(() => {
        //update state on props load
        if(Object.entries(props.user).length !== 0){
            setState({
                ...state,
                user: props.user,
                api_urls: props.api_urls,
                view_title: `${props.user.username}'s Library`,
            })
        }
    }, [props])

    const set_message = (message) => {
        setState({
            ...state,
            message: message,
        })
    }

    if(Object.entries(state.user).length === 0){
        return false;
    }
    return (
            <div className="text-center">
                <h1>{state.view_title}</h1>
                <h6>Quick Actions</h6>
                {state.message && <div className="dissappearing-message alert alert-success" role="alert">{state.message}</div>}
                <div className="btn-group w-100 mx-2" role="group" aria-label="Adding actions">
                    <AddBook 
                        user={state.user}
                        add_book_url={state.api_urls.book}
                        set_success_message={set_message} 
                    />
                    <AddShelf 
                        user={state.user}
                        add_shelf_url={state.api_urls.shelf}
                        set_success_message={set_message} 
                    />
                    <AddBookToShelf
                        user={state.user}
                        add_book_to_shelf_url={state.api_urls.book_to_shelf}
                        set_success_message={set_message}
                    />
                </div>
                <div>Filter Bar</div>
                <div>Books to Show</div>
            </div>
    )
}
