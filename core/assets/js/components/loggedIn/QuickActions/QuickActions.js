import React from 'react';

import ModalFormBase from '../forms/modalForms/ModalFormBase';
import AddBookForm from '../forms/modalForms/formInstances/addBookForm';

/**
 * 
 * @returns {object} - React component
 */
const QuickActions = (props) => {

    const [state, setState] = React.useState({
        user: {},
        update_user: null,
        api_urls: {},
        message: "",
    })

    React.useEffect(() => {
        //update state on props load
        if (props.user && Object.entries(props.user).length !== 0) {
            setState({
                ...state,
                user: props.user,
                update_user: props.update_user,
                api_urls: props.api_urls,
            })
        }
    }, [props]);

    const set_message = (message) => {
        setState({
          ...state,
          message: message,
        });
      };
    
      const clear_message = () => {
        setState({
          ...state,
          message: "",
        });
      };

    return (
    <div>
        <h4>Quick Actions</h4>
        <div className="container">
        <div className="w-100">
            {state.message && (
                <div
                    className="dissappearing-message alert alert-success"
                    role="alert"
                    onAnimationIteration={clear_message}
                >
                {state.message}
                </div>
            )}
            <div
                className="btn-group mx-auto"
                role="group"
                aria-label="Adding actions"
            >
                {/* //render props examples here: https://react.dev/reference/react/cloneElement#passing-data-with-a-render-prop */}
            <ModalFormBase
                user={state.user}
                render={(
                    show_modal,
                    set_show_modal,
                    error,
                    set_error,
                    capitalize_names,
                ) => {
                    return (
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
                    );
                }}
                />
                {/* <ModalFormBase
                user={state.user}
                render={(
                    show_modal,
                    set_show_modal,
                    error,
                    set_error,
                    capitalize_names,
                ) => {
                    return (
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
                    );
                }}
                /> */}
                {/* <ModalFormBase
                user={state.user}
                render={(
                    show_modal,
                    set_show_modal,
                    error,
                    set_error,
                    capitalize_names,
                ) => {
                    return (
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
                    );
                }}
                /> */}
            </div>
         </div>
       </div>
    </div>
    )
}

export default QuickActions;