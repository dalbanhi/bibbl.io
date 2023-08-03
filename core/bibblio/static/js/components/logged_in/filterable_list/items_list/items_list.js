const ItemsList = (props) => {

    const [state, setState] = React.useState({
        user: {},
        items: [],
    });

    React.useEffect(() => {
        //update state on props change
        setState({
            ...state,
            items: props.items,
            user: props.user,
        })
    }, [props]);   

    if(Object.keys(state.user).length === 0){
        return false;
    }
    return (
        <div className="container m-2 text-center">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">      
            {
                state.items.map((item) => {
                    if(props.item_type === "book"){
                        return(
                            <BookCard
                                book={item}
                                key={item.id}
                                user={state.user}
                                on_category_change={props.on_category_change}
                                on_shelf_change={props.on_shelf_change}
                                set_success_message={props.set_success_message}
                                book_url={props.book_url}
                                update_user={props.update_user}
                            />
                        )
                    }
                    else{
                        return(false);
                    }
                })
            }
            </div>
        </div>
    )
}