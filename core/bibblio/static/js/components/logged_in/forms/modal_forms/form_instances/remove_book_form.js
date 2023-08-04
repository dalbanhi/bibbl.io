// ReactBootstrap.Modal ideas from: https://react-bootstrap.netlify.app/docs/components/ReactBootstrap.Modal/
// React Bootstrap Checkboxhttps://react-bootstrap.netlify.app/docs/forms/checks-radios
const RemoveBookBadge = (props) => {
  return(
      <ClickableBadge
          onClick={props.handle_show}
          bg="danger"
          name="Remove from Library"
      />
  )
}

const RemoveBookForm = (props) => {
  const [state, setState] = React.useState({
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
  }, [props])

  const handle_submit = (event) => {
      event.preventDefault();
      console.log('remove book form submitted');

      fetch(props.book_url, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': Cookies.get('csrftoken'),
          },
          body: JSON.stringify({
              book_id: props.book.id,
              book_in_shelves_of_user: props.book_shelves.map(shelf => shelf.id),
              current_category: props.which_category,
              removing_book: true,
          }),
      })
      .then(response => response.json())
      .then(data => {
          console.log(data);
          if (data.error){
              props.set_error(data.error);
          }
          else{
              //if not error, tell app to show message, update state, and close modal
              props.update_user(data.user);
              props.set_success_message(data.message);
              props.set_error('');
              props.set_show_modal(false);
          }
      })
  }


  if(Object.entries(state.user).length === 0){
      return false;
  }
  return (
          <ModalFormWithButton
              form_button={<RemoveBookBadge handle_show={() => props.set_show_modal(true)}/>}
              title="Remove this book from your library?"
              handle_submit={handle_submit}
              handle_close={() => props.set_show_modal(false)}
              submit_button_text="Remove Book"
              submit_button_color="danger"
              show_modal={props.show_modal}
              error={props.error}
          >
            <ReactBootstrap.Modal.Body>
                    Warning: This will remove the book from your library and remove it from all of your shelves. This action cannot be undone.
                </ReactBootstrap.Modal.Body>
          </ModalFormWithButton>
  )
}