const ListFilter = (props) => {
 
    const [state, setState] = React.useState({
        user: {},
    });

    React.useEffect(() => {
        //update state on props load
        if(Object.entries(props.user).length !== 0){
            setState({
                ...state,
                user: props.user,
            })
        }
    }, [props]);

    if(Object.entries(state.user).length === 0){
        return false;
    }
    return (
        <div>ListFilter
            
        </div>
    )
}
