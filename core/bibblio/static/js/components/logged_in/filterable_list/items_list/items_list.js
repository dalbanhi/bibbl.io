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
        <div>
            {console.log("state, ", state)}
            {console.log("props", props)}            
            {
                state.items.map((item) => {
                    if(props.item_type === "book"){
                        return(
                            <BookCard
                                book={item}
                                key={item.id}
                                user={state.user}
                            />
                        )
                    }
                    else{
                        return(false);
                    }
                })
            }
        </div>
    )
}