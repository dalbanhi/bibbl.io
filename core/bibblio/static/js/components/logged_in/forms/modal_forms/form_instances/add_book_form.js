// ReactBootstrap.Modal ideas from: https://react-bootstrap.netlify.app/docs/components/ReactBootstrap.Modal/
// React Bootstrap Checkboxhttps://react-bootstrap.netlify.app/docs/forms/checks-radios
const AddBookButton = (props) => {
    return(
        <ReactBootstrap.Button
                variant="outline-primary"
                onClick={props.handle_show}
        >           
            <i className="bi bi-book">{` `}</i>
            Add Book
        </ReactBootstrap.Button>
    )
}

const AddBookForm = (props) => {
    const [state, setState] = React.useState({
        user: {},
        //order in which form will be displayed
        form_order: ['title', 'authors', 'publication_year', 'cover_image_url'],
        title: '',
        authors: '',
        publication_year: '',
        cover_image_url: '',
        read_category: 'read',
        shelves: [],
    })

    React.useEffect(() => {
        //update state on props load
        if(Object.entries(props.user).length !== 0){
            setState({
                ...state,
                user: props.user,
            })
        }
    }, [props])

    const handle_input_change = (event) => {
        setState({
            ...state,
            [event.target.name]: event.currentTarget.value,
        })
    }

    const handle_select_change = (event) => {
        let selected_items = [].slice.call(event.target.selectedOptions).map(item => item.value);
        setState({
            ...state,
            [event.target.name]: selected_items,
        });
    }

    const handle_submit = (event) => {
        event.preventDefault();

        fetch(props.add_book_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({
                title: state.title,
                authors: state.authors,
                publication_year: state.publication_year,
                cover_image_url: state.cover_image_url,
                read_category: state.read_category,
                shelves: state.shelves,
                user: state.user.id,
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error){
                props.set_error(data.error);
            }
            else{
                //if not error, tell app to show message, update state, and close modal
                props.update_user(data.user);
                props.set_success_message(data.message);
                props.set_error('');
                props.set_show_modal(false);
                setState({
                    ...state,
                    title: '',
                    authors: '',
                    publication_year: '',
                    cover_image_url: '',
                    read_category: 'read',
                    shelves: [],
                })
            }
        })
    }


    if(Object.entries(state.user).length === 0){
        return false;
    }
    return (
            <ModalFormWithButton
                form_button={<AddBookButton handle_show={() => props.set_show_modal(true)}/>}
                title="Add a Book to Your Library"
                handle_submit={handle_submit}
                handle_close={() => props.set_show_modal(false)}
                submit_button_text="Add Book!"
                submit_button_color="primary"
                show_modal={props.show_modal}
                error={props.error}
            >

                <TextControls 
                    parent_state={state}
                    handle_input_change={handle_input_change}
                    capitalize_names={props.capitalize_names}
                    fields={state.form_order}
                    form_name="add_book_form"
                    has_previous_values={false}
                />
                <InlineRadios 
                    parent_state={state}
                    handle_input_change={handle_input_change}
                    capitalize_names={props.capitalize_names}
                    fields={Object.keys(state.user).filter(key => key.startsWith("books_"))}
                    form_name="add_book_form"
                    title="read_category"
                    label={"Choose a " + props.capitalize_names("read_category")}
                />
                
                <MultiSelect
                    form_name="add_book_form"
                    label="Shelves"
                    name="shelves"
                    value={state.shelves}
                    handle_change={handle_select_change}
                    items_to_display={state.user.shelves}
                    item_type="shelf"
                    show_instructions={true}
                />
            </ModalFormWithButton>
    )
}