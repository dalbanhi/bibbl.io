const App = () => {

    const [state, setState] = React.useState({
        is_authenticated: null,
        user: null,
        menu_urls: {},
        is_register_view: null,
        api_urls: {},
    })

    React.useEffect(() => {


        const is_authenticated = JSON.parse(document.querySelector("#is_authenticated_data").textContent);

        const menu_urls = JSON.parse(document.querySelector("#menu_urls_data").textContent);

        const is_register_view = JSON.parse(document.querySelector("#is_register_view_data").textContent);

        const api_urls = JSON.parse(document.querySelector("#api_urls_data").textContent);
        
        if(is_authenticated){
            const user_data = JSON.parse(document.querySelector("#user_data").textContent);
            setState({
                ...state,
                is_authenticated: is_authenticated,
                user: user_data,
                menu_urls: menu_urls,
                is_register_view: is_register_view,
                api_urls: api_urls,
            })
        }
        else{
            setState({
                ...state,
                is_authenticated: is_authenticated,
                menu_urls: menu_urls,
                is_register_view: is_register_view,
                api_urls: api_urls,
            })
        }
    }, []);

    const handle_login = (login_or_out, user_id) => {

        //get user data and update url name for my profile
        let user;
        if (login_or_out==="login"){
            fetch(`/users/${user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
            })
            .then((response) => response.json())
            .then((data) => {
                user = data;
                setState({
                    ...state,
                    is_authenticated: login_or_out==="login" ? true : false,
                    user: user,
                });
            });
        }        
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
                {
                    !state.is_authenticated? 
                    <LoggedOutView 
                        is_register_view={state.is_register_view}
                        menu_urls={state.menu_urls} 
                        auth_change={handle_login}
                    /> : 
                    <LoggedInView 
                        user={state.user}
                        api_urls={state.api_urls}
                    />
                }
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