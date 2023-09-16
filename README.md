<!-- Using README template from: https://github.com/othneildrew/Best-README-Template/tree/master-->

<a name="readme-top"></a>


<!-- PROJECT SHIELDS -->
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/dalbanhi/bibbl.io">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Bibbl.io</h3>

  <p align="center">
    Bibbl.io is a book/reading organizer, made for Harvard's CSCI-33A course: Web Programming with Python and JavaScript
    <br />
    <a href="https://github.com/dalbanhi/bibbl.io"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://www.loom.com/share/34f2430708e2486ba75cbe5630406845?sid=a76dc5dd-321c-4f64-bd6e-7e6f4ee9ef44">View Demo</a>
    ·
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Bibbl.io is a book/reading organizer. The goal is to help students, academics, and bookworms organize their reading priorities and keep a more detailed log of their reading by allowing users to organize books by reading status and “shelves” and keep better track of their reading habits.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Django][Django]][Django-url]
* [![React][React.js]][React-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Setting up and Running the Project

To run the project, follow the instructions below:

### Prerequisites

Make sure npm is installed
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo.

   ```sh
   git clone https://github.com/dalbanhi/bibbl.io.git
   ```

2. cd into the "core" directory. Then, install NPM packages
   ```sh
   npm install
   ```
3. Install requirements.txt
   ```sh
   pip install -r requirements.txt
   ```
4. Run 
   ```sh 
    python manage.py makemigrations
   ```
5. Run 
   ```sh 
    python manage.py migrate
   ```
6. Run 
   ```sh 
    python manage.py runserver
   ```
7. Open Browser at: http://127.0.0.1:8000/

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Live Demo Video link: [Bibbl.io Demo](https://www.loom.com/share/34f2430708e2486ba75cbe5630406845?sid=a76dc5dd-321c-4f64-bd6e-7e6f4ee9ef44)

[YouTube link](https://youtu.be/WxLeg6Ww1y0)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

Here's a quick layout of my project
- **core/** <-- this directory holds the usual Django project stuff
- **bibblio/** <-- holds my main app
  - **templates/** <-- holds my templates
    - _index.html_ <-- my main entry point. Holds a lot of script tags referencing all of my front end files.
    - _layout.html_ <-- holds external JS (React, ReactDOM, Babel, and ReactBootstrap, which I normally would have npm installed)
  - _admin.py_ <-- I set up a barebones admin to help me add some users, books and shelves.
  - _models.py_ <-- I have three models, User, Book and Shelf. 
                Users have three differenty types of Books lists (read, reading, to_read). They also have shelves (can be called anything). 
                Books can exist independently of Users and of shelves. the idea behind that is that as more people use the app, it can be easier to find/add books. In the future, I would want to have ISBN addition for more finite book specification, etc. Currently, books only NEED titles, but if a book of a different title is attempted to be created, there will be an error asking for more information.
                Shelves have owners and hold books. 
  - _tests.py_ <-- This holds my tests. I only was able to add a few tests for the backend and only one for the front end/client testing.
  - _views.py_ <-- My main views. Used mostly as a backend. Please see the file for more details.
  - **static/** <-- holds assets and JS
    - **assets/** <-- holds a small icon for the menu header
    - **js/components/** <-- holds all of my front end work
      - **logged_in/** <-- holds all components related to being logged in
        - **filterable_list.js** <-- parent component for the filterable list. I ran out of time to fully componetize this parent component. It has some radio buttons (for read, reading, to_read categories) and some checkboxes (for your shelves) to filter what you books/items you are seeing. 
          - **items_list/**_items_list.js_ <-- the actual list of items (for now, only books, in the future, also reading sessions)
            - **items/** <-- holds items and helper components for items
              - _book_card.js_ <-- a little card to see a book's details. You can also click on badges on it to filter the list and also edit the book/remove it form your library with those badges
              - _clickable_badges_ <-- stylized buttons on the book/ shelf view that allows you to send forms to edit information about them OR are used to change the filters
          - **shelf_editor**_shelf_editor.js_ <-- a little window that allows you to edit/remove the shelf you are looking at.
        - **forms/** <-- holds all forms used to edit the users/books/shelves
          -  **modal_forms/** <-- Initially, I had forms that were not modal, but for now all of them are
            - _modal_form_base.js_ <-- A base form that handles closing/opening the modal for all other form instances. Uses render props to render form instances.
            - **form_instances/** <-- holds all forms used to edit db data (add book, add shelf, etc)
            - **form_elements/** <-- holds all elements used to make up a list (radio groups, text inputs, etc)
              - _modal_form_with_button.js_ <-- receives children from form instances and abstracts out the closing/opening passed in from modal_form_base.
        - **item_view_switcher/** <-- holds a (currently) unused component trying to switch between reading sessions (a model I did not yet create) and books.
        - **quick_actions/** <-- A component at the top that lets the user "Quickly" add some books, shelves, and books to shelves
          - _quick_actions.js_
        - _logged_in_view.js_ <-- parent component for logged in view, holds quick actions and a filterable list.
      - **logged_out/** <-- holds all components related to being logged out
        - **forms/**
          - _login_form.js_ 
        - _logged_out_view.js_ <-- holds the very simple logged out view (mostly holding the form, a welcome tag, and a video)
      - **navigation/** <-- navigation
        - _my_nav_bar.js_ <-- can login/logout. Doesn't do much else for now, though I had other plans. 
      - _app.js_ <-- main app component, the only one rendered directly on the django template
    - **styles/** <-- holds my sass/css files. I had to npm install bootstrap for this even though I'm also getting it directly in a script tag for React.  

### Design Decisions


#### Overview
For this final project, I decided to make this more of a single-page app, with Django on the backend and React in the front end. While I was not able to get them fully separate and have the React app fully consume the backend (due to time constraints and unfamiliarity with webpack), I was able to load all of my scripts statically into the index.html template on my django app. This created some limitations for me, as I was not able to use npm install to install regular React libraries that might have been helpful, like react-select. However, it allowed me to grow in my understanding of React a lot. 

I chose to make a single-page app because I thought that the process of filtering things would be cool, and for my last project (network), I used more of a hybrid model of a different sorts, with more django templates injecting data to the front end through json script tags, but that got a little unwieldy. I liked the idea of having a single entry point for my app, and having one top level app component control the state really helped when there were user updates and filtering updates. 

This meant that I also rewrote the whole usual user login/registration form(s) using React, which was difficult, but ultimately rewarding as the reload is immediate on login/logout! The bulk of my work was in two parts: making a bunch of forms to edit the database and updating with the results, and filtering the view of the books. 

##### Making a form template
  I spent a good amount of time on this project trying to figure out how to reuse code when I had very similar forms that all differed in what content they had and on the action that their "submit" function would take. I ended up learning a lot about rendering children in React through my implementation of the modal_form_base.js and modal_form_with_button.js, and all the intermediate forms. This allowed me to make forms easily, especially since I also broke down the forms into reusable components.

##### Making a filterable list
 The other part of my project I want to highlight is what I spent on in making a filterable list. This was the main drive for why I wanted to work on this project, to see a rapidly updating view of items organized by two dimensions: reading category ("read", "reading", "to_read"), and any number of shelves. A book can only be in one category at a time, but can be in many shelves. I liked the challenge of using JavaScript to make smooth transitions, and it was helpful to have everything live in the same state controlled by App so that updating the user usually updated everything. I learned a lot also about updating state, especially through the function that takes in the old state. That was necessary when updating elements that were already visible but had changed. 

 ##### Out of scope for now
 As I spent a lot of time on the front end of my website with my complex filtering, I didn't quite get to the better/best attributes I had originally set out for, mainly getting to also add ReadingSessions, models that would be attached to a user for a given book. The idea was you could open the app and see either Books or reading Sessions, and easily start a reading session for a book at the top in Quick Actions. I did not get there due to time constraints. Ideally, I would want to edit my filterable list so it could display ReadingSessions as well as books, and have different filters for the Reading Sessions (view all ones for a book, view by date, etc). Even so, I hope to continue working on this and implement these. 




<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

David Alban Hidalgo - dalbanhi@gmail.com

Project Link: [https://github.com/dalbanhi/bibbl.io](https://github.com/dalbanhi/bibbl.io)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Brian Yu - Instructor](https://brianyu.me/)
* [Doug Lloyd - Head Teaching Fellow ](https://douglloyd.com/)
* [Logan Kilpatrick - Teaching Fellow](https://logank.ai/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[license-shield]: https://img.shields.io/github/license/dalbanhi/bibbl.io.svg?style=for-the-badge
[license-url]: https://github.com/dalbanhi/bibbl.io/blob/main/LICENSE.txt
<!-- [] -->
[Django]: https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django
[Django-url]: https://www.djangoproject.com/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com