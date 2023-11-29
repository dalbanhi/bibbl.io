//toggle button group from react bootstrap:
// https://react-bootstrap.netlify.app/docs/components/buttons/#togglebuttongroup

/**
 * A component that displays a list of books or shelves that can be filtered by category and shelves. If only one shelf is selected, displays a shelf editor.
 * @param {object} props - the props passed in from the parent component
 * @param {object} props.user - the user object
 * @param {function} props.update_user - the function to update the user object in state at the app level
 * @param {string} props.book_url - the url to access the book api
 * @param {string} props.shelf_url - the url to access the shelf api
 * @param {string} props.initial_book_list_name - the name of the book list to show initially
 * @returns {React.Component}
 */
const FilterableList = (props) => {
    const [state, setState] = React.useState({
      user: {},
      current_book_list_name: "",
      selected_category: "all",
      items: [],
      item_type: "book",
      selected_shelves_ids: [], //ids of selected shelves
      show_single_shelf: false,
    });
  
    React.useEffect(() => {
      //wait for props to load
      if (Object.entries(props.user).length !== 0) {
        const book_lists = Object.keys(props.user).filter((key) =>
          key.startsWith("books_"),
        );
  
        const all_books = props.user.books_read.concat(
          props.user.books_reading,
          props.user.books_to_read,
        );
  
        setState((oldState) => {
          //need to filter new books in props.user by oldState.selected_category and oldState.selected_shelves_ids
          let filtered_items;
          //if there were no books last, return all books
          if (oldState.user == {}){
            filtered_items = all_books;
          }
          else{
            //otherwise, there was a previous state, so filter books by the previous state, using the selected category and selected shelves
            const options = {
              category_change: false,
              shelf_change: false,
            }
            filtered_items = filter_books(oldState, options);
          }
          return {
            ...state,
            user: props.user,
            current_book_list_name: props.initial_book_list_name,
            read_categories: ["all", ...book_lists],
            items: filtered_items,
        }});
      }
    }, [props]);
  
    /** 
     * Function to filter books by a selected number of shelves
     * @param {array} books - the array of books to filter
     * @param {array} selected_shelves_ids - the array of selected shelves ids
    */
    const filter_by_selected_shelves = (books, selected_shelves_ids) => {
      //if there are no selected shelves, return all books
      if (selected_shelves_ids.length === 0) {
        return books;
      }
      //otherwise, filter books by selected shelves
      let filtered_books = books.filter((book) => {
        let book_shelves_ids = book.in_shelves;
        //if any of the books shelves are in the selected shelves, return true
        for (let i in selected_shelves_ids) {
          let shelf_id = selected_shelves_ids[i];
          if (book_shelves_ids.includes(shelf_id)) {
            return true;
          }
        }
        return false;
      });
      return filtered_books;
    };
  
    /**
     * Function to filter books by category and shelves
     * @param {object} oldState - previous state, so we can know by which category or shelves to filter by
     * @param {object} options an object containing category_change and shelf_change, as well as new_category and new_shelves if applicable
     * @returns
     */
    const filter_books = (oldState, options) => {
      const { category_change, shelf_change, new_category, new_shelves } =
        options;
  
      let books = [];
      if (category_change) {
        //get initial books with new category
        books =
          new_category === "all"
            ? oldState.user.books_read.concat(
              oldState.user.books_reading,
              oldState.user.books_to_read,
              )
            : oldState.user[new_category];
        //filter by selected shelves of old state
        books = filter_by_selected_shelves(books, oldState.selected_shelves_ids);
        
      } else if (shelf_change) {
        // use old state to get inital books with old category
        books =
        oldState.selected_category === "all"
            ? oldState.user.books_read.concat(
              oldState.user.books_reading,
              oldState.user.books_to_read,
              )
            : oldState.user[oldState.selected_category];
        //filter by new shelves
        books = filter_by_selected_shelves(books, new_shelves);
      }
      else{
        //read the old state selected category but use props.user info
        books =
          oldState.selected_category === "all"
          ? props.user.books_read.concat(
            props.user.books_reading,
            props.user.books_to_read,
            )
          : props.user[oldState.selected_category];
        //filter by selected shelves of old state
        books = filter_by_selected_shelves(books, oldState.selected_shelves_ids);
      }
      return books;
    };
  
    /**
     *  helper function to deal with both cases of selecting a shelf by clicking a checkbox or by clicking a badge
     * @param {list} shelves_to_show 
     */
    const update_shelves_to_show = (shelves_to_show) => {
      const options = {
        shelf_change: true,
        new_shelves: shelves_to_show,
      };
  
      setState((oldState) => {
        let filtered_items = filter_books(oldState, options);
  
        return {
          ...oldState,
          selected_shelves_ids: shelves_to_show,
          items: filtered_items,
          show_single_shelf: shelves_to_show.length === 1,
        };
      });
    };
  
    //when a shelf is clicked by badge in the book card, select only this shelf
    const on_shelf_select_click = (event) => {
      //get shelf_id
      const clicked_shelf_id = parseInt(event.target.attributes.value.value);
  
      //clear shelves to show and only add the clicked shelf
      let shelves_to_show = [];
      shelves_to_show.push(clicked_shelf_id);
  
      //clear all checkboxes except the one matching the clicked pill
      // https://stackoverflow.com/questions/15148659/how-can-i-use-queryselector-on-to-pick-an-input-element-by-name
      //get all checkboxes
      let checkboxes = document.querySelectorAll('input[name="shelves_checked"]');
      for (let i = 0; i < checkboxes.length; i++) {
        let checkbox = checkboxes[i];
        if (parseInt(checkbox.value) === clicked_shelf_id) {
          checkbox.checked = true;
        } else {
          checkbox.checked = false;
        }
      }
      //update shelves with new shelves to show
      update_shelves_to_show(shelves_to_show);
      //reroute to top of the screen?
    };
  
    //getting multiple selected checkboxes from a check collection
    // https://www.geeksforgeeks.org/how-to-get-multiple-checkbox-values-in-react-js/
  
    //when a checkbox is clicked to change shelves
    const on_shelf_select_change = (event) => {
      const { value, checked } = event.target;
  
      const selected_shelf_id = parseInt(value);
  
      let shelves_to_show = [...state.selected_shelves_ids];
      if (checked) {
        //add shelf to selected shelves
        shelves_to_show.push(selected_shelf_id);
      } else {
        //remove shelf from selected shelves
        shelves_to_show = shelves_to_show.filter(
          (shelf_id) => shelf_id !== selected_shelf_id,
        );
      }
      //update shelves with new shelves to show
      update_shelves_to_show(shelves_to_show);
    };
  
    //when a category badge is clicked inside a book card
    const on_category_change_click = (event) => {
      const category = event.target.attributes.value.value;
      on_category_change(category);
    };
  
    const on_category_change = (category) => {
      const options = {
        category_change: true,
        new_category: category,
      };
      setState((oldState) => {
        let filtered_items = filter_books(oldState, options);
        return {
          ...oldState,
          selected_category: category,
          items: filtered_items,
        };
      });
    };
  
    const capitalize_names = (field_name) => {
      field_name = field_name
        .replace("book_", "")
        .replace("books_", "")
        .replace("_", " ");
  
      //capitalize each word and replace underscores with spaces
      field_name = field_name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return field_name;
    };
  
    if (Object.entries(state.user).length === 0) {
      return false;
    }
    return (
      <div className="m-2">
        <ReactBootstrap.Card className="text-center">
          <ReactBootstrap.Card.Header>Filter</ReactBootstrap.Card.Header>
          <ReactBootstrap.Card.Title>
            {state.current_book_list_name}
            {state.selected_category !== "all" && (
              <span>({capitalize_names(state.selected_category)})</span>
            )}
          </ReactBootstrap.Card.Title>
          <ReactBootstrap.Card.Body>
            <ReactBootstrap.ToggleButtonGroup
              type="radio"
              name="read_category"
              value={state.selected_category}
              onChange={on_category_change}
            >
              {state.read_categories.map((category, index) => {
                //for each cateogry, create a button
                return (
                  <ReactBootstrap.ToggleButton
                    key={index}
                    id={"category_button_" + category}
                    value={category}
                  >
                    {capitalize_names(category)}
                  </ReactBootstrap.ToggleButton>
                );
              })}
            </ReactBootstrap.ToggleButtonGroup>
          </ReactBootstrap.Card.Body>
          <ReactBootstrap.Card.Footer>
            <ReactBootstrap.Card.Title>Your Shelves</ReactBootstrap.Card.Title>
            <ReactBootstrap.Card.Body>
              <ReactBootstrap.Form>
                <ReactBootstrap.Form.Group
                  className="mb-3"
                  controlId="shelves_filter"
                >
                  {state.user.shelves.map((shelf, index) => {
                    return (
                      <ReactBootstrap.Form.Check
                        inline
                        type="checkbox"
                        label={shelf.name}
                        name="shelves_checked"
                        id={"shelves_checked_" + shelf.id}
                        key={index}
                        onChange={on_shelf_select_change}
                        value={shelf.id}
                      />
                    );
                  })}
                </ReactBootstrap.Form.Group>
              </ReactBootstrap.Form>
            </ReactBootstrap.Card.Body>
          </ReactBootstrap.Card.Footer>
        </ReactBootstrap.Card>
        {state.show_single_shelf && (
          <ShelfEditor
            user={state.user}
            update_user={props.update_user}
            shelf_id={state.selected_shelves_ids[0]}
            shelf_url={props.shelf_url}
          />
        )}
  
        <ItemsList
          user={state.user}
          book_url={props.book_url}
          items={state.items}
          item_type={state.item_type}
          on_category_change={on_category_change_click}
          on_shelf_change={on_shelf_select_click}
          update_user={props.update_user}
        />
      </div>
    );
  };
  