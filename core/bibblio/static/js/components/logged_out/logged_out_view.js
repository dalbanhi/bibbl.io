const LoggedOutView = (props) => {
    const [state, setState] = React.useState({
        is_register_view: '',
        no_user_urls: {},
        auth_change: null,
    })

    React.useEffect(() => {
        //update state on props load
        if(Object.entries(props.menu_urls).length !== 0){
            const no_user_urls = Object.keys(props.menu_urls).reduce((acc, key) => {
                    if (props.menu_urls[key].auth === "not_authenticated"){
                      acc[key] = props.menu_urls[key];
                    }
                    return acc;
                  }, {});

            setState({
                ...state,
                is_register_view: props.is_register_view,
                no_user_urls: no_user_urls,
                auth_change: props.auth_change,
            })
        }
    }, [props])

    return (
        <div>
            <h1>Welcome</h1>
            <LogInForm
                is_register_view={state.is_register_view}
                action_urls={state.no_user_urls} 
                auth_change={state.auth_change}
            />
        </div>
    )
}