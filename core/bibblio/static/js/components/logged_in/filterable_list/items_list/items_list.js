/**
 * 
 * @param {object} props - passed in by parent (FilterableList)
 * @param {object} props.user - user object
 * @param {string} props.book_url - url for book endpoint
 * @param {array} props.items - items to display
 * @param {string} props.item_type - type of item to display
 * @param {function} props.on_category_change - function to handle category change
 * @param {function} props.on_shelf_change - function to handle shelf change
 * @param {function} props.update_user - function to update user
 * 
 * @returns {React.Component} a list of items. If item_type is book, returns a list of BookCards, otherwise (in the future) will return a list of ReadingSessionCards
 */
const ItemsList = (props) => {
  const [state, setState] = React.useState({
    user: {},
    items: [],
  });

  React.useEffect(() => {
    //update state on props change
    if (Object.entries(props.user).length !== 0) {
      setState({
        ...state,
        items: props.items,
        user: props.user,
      });
    }
  }, [props]);

  if (!state.items) {
    return false;
  }
  return (
    <div className="container m-2 text-center">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
        {state.items.map((item) => {
          if (props.item_type === "book") {
            return (
              <BookCard
                book={item}
                key={item.id}
                user={state.user}
                on_category_change={props.on_category_change}
                on_shelf_change={props.on_shelf_change}
                set_success_message={props.set_success_message}
                book_url={props.book_url}
                update_user={props.update_user}
              />
            );
          } else {
            return false;
          }
        })}
      </div>
    </div>
  );
};
