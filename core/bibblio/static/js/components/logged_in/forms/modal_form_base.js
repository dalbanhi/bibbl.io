const ModalFormBase = (props) => {

//props
// action url
// set successs message function
//update user function
// user

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
          // show_modal: props.show_modal,
      })
    }
  }, [props]);

  const set_show_modal = (show_modal) => {
    setState({
      ...state,
      show_modal: show_modal,
    })
  }

  const handle_show = () => {
    console.log("showing here")
    setState({
    ...state,
    show_modal: true,
    })
  }

  const handle_close = () => {
    setState({
    ...state,
    show_modal: false,
    })
  }

  const set_error = (error) => {
  console.log("SETTING ERRROR HERE");
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