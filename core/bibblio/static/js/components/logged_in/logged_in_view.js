// bootstrap icons: 
// book: https://icons.getbootstrap.com/icons/book/
// bookshelf: https://icons.getbootstrap.com/icons/bookshelf/
// bookmark: https://icons.getbootstrap.com/icons/bookmark/


const LoggedInView = (props) => {

    const [state, setState] = React.useState({
        user: {},
        api_urls: {},
        message: '',
        subtitle: '',
    })

    React.useEffect(() => {
        //update state on props load
        if(Object.entries(props.user).length !== 0){
            setState({
                ...state,
                user: props.user,
                api_urls: props.api_urls,
                subtitle: "All Books",
            })
        }
    }, [props])

    const set_message = (message) => {
        setState({
            ...state,
            message: message,
        })
    }

    const clear_message = () => {
        setState({
            ...state,
            message: '',
        })
    }

    const handle_book_list_name_change = (new_book_list) => {

        const found_shelf = state.user.shelves.find((shelf) => shelf.name === new_book_list);

        setState({
            ...state,
            subtitle : found_shelf? found_shelf.name : "All Books",
        })
    }

    if(Object.entries(state.user).length === 0){
        return false;
    }
    return (
            <div className="text-center">
                <h1>{`${props.user.username}'s Library`}</h1>
                <h4>Quick Actions</h4>
                {state.message && <div className="dissappearing-message alert alert-success" role="alert" onAnimationIteration={clear_message}>{state.message}</div>}
                <div className="container">
                    <div className="w-100">
                        <div className="btn-group mx-auto" role="group" aria-label="Adding actions">
                            {/* render props examples here: https://react.dev/reference/react/cloneElement#passing-data-with-a-render-prop */}
                            <ModalFormBase
                                user={state.user}
                                render={(show_modal, set_show_modal, error, set_error, capitalize_names) => {
                                    return(
                                        <AddBookForm
                                            user={state.user}
                                            update_user={props.update_user}
                                            set_success_message={set_message}
                                            add_book_url={state.api_urls.book}
                                            //render props
                                            show_modal={show_modal}
                                            set_show_modal={set_show_modal}
                                            capitalize_names={capitalize_names}
                                            error={error}
                                            set_error={set_error}
                                        />
                                    )
                                }} 
                            />
                            <ModalFormBase
                                user={state.user}
                                render={(show_modal, set_show_modal, error, set_error, capitalize_names) => {
                                    return(
                                        <AddShelfForm
                                            user={state.user}
                                            update_user={props.update_user}
                                            set_success_message={set_message}
                                            add_shelf_url={state.api_urls.shelf}
                                            //render props
                                            show_modal={show_modal}
                                            set_show_modal={set_show_modal}
                                            capitalize_names={capitalize_names}
                                            error={error}
                                            set_error={set_error}
                                        />
                                    )
                                }} 
                            />
                            <ModalFormBase
                                user={state.user}
                                render={(show_modal, set_show_modal, error, set_error, capitalize_names) => {
                                    return(
                                        <AddBookToShelfForm
                                            user={state.user}
                                            update_user={props.update_user}
                                            set_success_message={set_message}
                                            add_book_to_shelf_url={state.api_urls.shelf}
                                            //render props
                                            show_modal={show_modal}
                                            set_show_modal={set_show_modal}
                                            capitalize_names={capitalize_names}
                                            error={error}
                                            set_error={set_error}
                                        />
                                    )
                                }} 
                            />
                        </div>
                    </div>
                </div>
                
                {/* <ShelfLinks
                    user={state.user}
                    handle_book_list_change={handle_book_list_name_change}
                    title={state.subtitle}
                /> */}
                <p className="m-2">Hint: Select a single shelf to edit the shelf name or remove it from you library. </p>
                <FilterableList
                    user={state.user}
                    book_url={state.api_urls.book}
                    shelf_url={state.api_urls.shelf}
                    initial_book_list_name={state.subtitle}
                    update_user={props.update_user}
                />
            </div>
    )
}
