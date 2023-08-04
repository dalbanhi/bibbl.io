const ModalFormBase = (props) => {

  const [state, setState] = React.useState({
    show_modal: false,
    error: '',
    user: {},
  })

  React.useEffect(() => {
    //update state on props load
    if(Object.entries(props.user).length !== 0){
      setState({
          ...state,
          user: props.user,
      })
    }
  }, [props]);

  const set_show_modal = (show_modal) => {
    console.log("set_show_modal");
    setState({
      ...state,
      show_modal: show_modal,
    })
  }

  const set_error = (error) => {
    setState({
    ...state,
    error: error,
    })
  }

  const capitalize_names = (field_name) => {
    field_name = field_name.replace("book_", "").replace("books_", "").replace("_", " ");

    //capitalize each word and replace underscores with spaces
    field_name = field_name.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    return field_name;
  }



  if(Object.entries(state.user).length === 0){
    return false;
  }
  return (
    <div>
      {props.render(state.show_modal, set_show_modal, state.error, set_error, capitalize_names)}
    </div>
  )
  }