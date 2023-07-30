// bootstrap icons: 
// book: https://icons.getbootstrap.com/icons/book/
// bookshelf: https://icons.getbootstrap.com/icons/bookshelf/
// bookmark: https://icons.getbootstrap.com/icons/bookmark/


const LoggedInView = (props) => {
    const [state, setState] = React.useState({
        user: {},
        api_urls: {},
        message: '',
    })

    React.useEffect(() => {
        //update state on props load
        if(Object.entries(props.user).length !== 0){
            setState({
                ...state,
                user: props.user,
                api_urls: props.api_urls,
            })
        }
    }, [props])

    const set_message = (message) => {
        setState({
            ...state,
            message: message,
        })
    }

    if(Object.entries(state.user).length === 0){
        return false;
    }
    return (
            <div className="text-center">
                <h1>{props.user.username}'s Library</h1>
                {state.message && <div className="dissappearing-message alert alert-success" role="alert">{state.message}</div>}
                <div className="btn-group w-100 mx-2" role="group" aria-label="Adding actions">
                    <AddBook 
                        user={state.user}
                        add_book_url={state.api_urls.book}
                        set_success_message={set_message} 
                    />
                    <AddShelf 
                        user={state.user}
                        // add_book_url={state.api_urls.book}
                        set_success_message={set_message} 
                    />
                    <button 
                        type="button" 
                        className="btn btn-outline-primary"
                    >
                        <i className="bi bi-bookmark">{` `}</i>
                        Add Book to Shelf
                    </button>
                </div>
                <div>Filter Bar</div>
                <div>Books to Show</div>
            </div>
    )
}

{/* <script>var Alert = window.ReactBootstrap.Alert;
        var Button = window.ReactBootstrap.Button;
        console.log(Alert, Button)
        </script> */}


// import { useState } from 'react';
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';

// function Example() {
//   const [show, setShow] = useState(false);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   return (
//     <>
//       <Button variant="primary" onClick={handleShow}>
//         Launch demo modal
//       </Button>

//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Modal heading</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleClose}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }

// export default Example;
