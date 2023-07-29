const App = () => {

    const [state, setState] = React.useState({
        is_authenticated: null,
        user: null,
        menu_urls: {},
        is_register_view: null,
    })

    React.useEffect(() => {


        const is_authenticated = JSON.parse(document.querySelector("#is_authenticated_data").textContent);

        const menu_urls = JSON.parse(document.querySelector("#menu_urls_data").textContent);

        const is_register_view = JSON.parse(document.querySelector("#is_register_view_data").textContent);
        
        if(is_authenticated){
            const user_data = JSON.parse(document.querySelector("#user_data").textContent);
            setState({
                ...state,
                is_authenticated: is_authenticated,
                user: user_data,
                menu_urls: menu_urls,
                is_register_view: is_register_view,
            })
        }
        else{
            setState({
                ...state,
                is_authenticated: is_authenticated,
                menu_urls: menu_urls,
                is_register_view: is_register_view,
            })
        }
    }, []);

    const handle_login = (login_or_out) => {
        console.log("handle_login/out");
        // console.log(event.target.name);
        // console.log(event.target.value);
        setState({
            ...state,
            is_authenticated: login_or_out==="login" ? true : false,
        });
    }

    const handle_logout = (event) => {

    }

    const logged_out_view = () => {
        // console.log(state.menu_urls)
        const no_user_urls = Object.keys(state.menu_urls).reduce((acc, key) => {
            if (state.menu_urls[key].auth === "not_authenticated"){
              acc[key] = state.menu_urls[key];
            }
            return acc;
          }, {});
        return (
            <LoginRegister
                is_register_view={state.is_register_view}
                action_urls={no_user_urls} 
                auth_change={handle_login}
            />
        )
    }

    const logged_in_view = () => {
        return (
            <p>books and stuff here</p>
        )
    }

    return (
        <div>
            <MyNavBar 
                is_authenticated={state.is_authenticated}
                user={state.user}
                menu_urls={state.menu_urls}
                auth_change={handle_login}
            />
            <div className="container w-75 wizard-bg-color">
                <h1>Welcome</h1>
                {!state.is_authenticated? logged_out_view() : logged_in_view()}
            </div>
        </div>
    )
}


const app_container = document.querySelector("#app_container");
if(app_container){
    const app_root = ReactDOM.createRoot(app_container);
    if (app_root){
        app_root.render(
            <App/>
        );
    }
}