/**
 * Component to switch between books and reading session items. Not currently implemented/in use.
 * @param {*} props 
 */
const ItemViewSwitcher = (props) => {
  // const [state, setState] = React.useState({
  //   user: {},
  //   title: "",
  //   shelves: [],
  //   empty_shelf: {
  //     name: "All Books",
  //   },
  // });

  // React.useEffect(() => {
  //   if (Object.entries(props.user).length !== 0) {
  //     setState({
  //       ...state,
  //       user: props.user,
  //       shelves: [state.empty_shelf, ...props.user.shelves],
  //       title: props.title,
  //     });
  //   }
  // }, [props]);

  // const handle_select = (shelf_name) => {
  //   props.handle_book_list_change(shelf_name);

  //   setState({
  //     ...state,
  //     title: shelf_name,
  //   });
  // };

  // if (Object.entries(state.user).length === 0) {
  //   return false;
  // }
  // return (
  //   <div className="m-2">
  //     {/* {console.log(state.user)} */}
  //     <p>Select a shelf here to edit that shelf.</p>
  //     <ReactBootstrap.DropdownButton
  //       as={ReactBootstrap.ButtonGroup}
  //       size="sm"
  //       id="dropdown-button-drop-up"
  //       drop="down"
  //       variant="info"
  //       title={state.title}
  //     >
  //       {state.shelves.map((shelf, index) => {
  //         return (
  //           <ReactBootstrap.Dropdown.Item
  //             key={index}
  //             onClick={() => handle_select(shelf.name)}
  //           >
  //             {shelf.name}
  //           </ReactBootstrap.Dropdown.Item>
  //         );
  //       })}
  //     </ReactBootstrap.DropdownButton>
  //   </div>
  // );
};
