/**
Course:     INF 651 VC
Project:    Final Project - Acme Blogs
Author:     Justin Henley, jahenley@mail.fhsu.edu
Date:       2021-11-30

Description:    A complete definition of the functions specified in the assignment. Provides the JS that powers the blog site.
*/

// TODO discussion for project

/**
 * Receives up to 3 parameters and returns a newly-created HTML element
 *
 * @function createElemWithText
 * @param {String} htmlElem - The HTML element string name to be created (h1, p, button, etc) (optional)
 * @param {String} textContent - The text content of the element to be created (optional)
 * @param {String} className - A className if one is to be applied (optional)
 * @returns {HTMLElement} The created element.
 */
const createElemWithText = (htmlElem = "p", textContent = "", className) => {
  // Create the new element
  const newElement = document.createElement(htmlElem);

  // Set the other attributes
  newElement.textContent = textContent;
  if (className) newElement.className = className;

  // Return the created element
  return newElement;
};

/**
 * Creates an array of select options representing all blog users
 *
 * @function createSelectOptions
 * @param {JSON} users - JSON data representing the users of the blog
 * @returns {any[]} An array of options HTMLElements representing blog users
 */
const createSelectOptions = (users) => {
  // Return early if no parameter received
  if (!users) return undefined;

  // Create array of options elements
  const optionElements = [];

  // Loop through user data
  users.forEach((user) => {
    // Create a new option
    const option = document.createElement("option");

    // Add user data to the option
    option.value = user.id;
    option.textContent = user.name;

    // Push new option to array
    optionElements.push(option);
  });

  // Return array of options elements
  return optionElements;
};

/**
 * Toggles the class 'hide' on the section element containing the comments of the specified post
 *
 * @function toggleCommentSection
 * @param {String} postId - The post on which to toggle comments
 * @returns {HTMLElement} The comment section of the specified post
 */
const toggleCommentSection = (postId) => {
  // Return early if no postId given
  if (!postId) return undefined;

  // Select the section
  const section = document.querySelector(`section[data-post-id='${postId}']`);

  // Return null is postId not found
  if (!section) return null;

  // Toggle the class
  section.classList.toggle("hide");
  return section;
};

/**
 * Toggles the comments button on the specified post between "Show Comments" and "Hide Comments"
 *
 * @function toggleCommentButton
 * @param {String} postId - The post on which to toggle the comment button text
 * @returns {Element} The comment button of the specified post
 */
const toggleCommentButton = (postId) => {
  // Return early if no postId given
  if (!postId) return undefined;

  // Select the button
  const button = document.querySelector(`button[data-post-id='${postId}']`);

  // Return null if postId not found
  if (!button) return null;

  // Toggle the text content
  button.textContent =
    button.textContent === "Show Comments" ? "Hide Comments" : "Show Comments";
  return button;
};

/**
 * Deletes all children of a specified HTML parent element
 *
 * @function deleteChildElements
 * @param {Element} parentElement - The element from which to remove all children
 * @returns {Element} The parent element
 */
const deleteChildElements = (parentElement) => {
  const isDOM = (el) => el instanceof Element;

  // Return early if no element received. or if the parameter is not a valid element name
  if (!parentElement || !isDOM(parentElement)) return undefined;

  // Define the child
  let child = parentElement.lastElementChild;

  // While a child still exists, remove it
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }

  // Return the parentElement once all children removed
  return parentElement;
};

/*
NOTE: The above functions had no dependency on other functions. They were very
self-contained which is ideal. That is not always possible though. We will try to limit
dependencies as we go. The next several functions have small dependencies.
*/

/**
 * Adds event listeners to all buttons found in main, calling the toggleComments function
 *
 * @function addButtonListeners
 * @returns {NodeListOf<Element>} All buttons nested inside the main element
 * @requires toggleComments()
 */
const addButtonListeners = () => {
  // Select all buttons inside the main element
  const buttons = document.querySelectorAll("main button");

  // Return if no buttons
  if (!buttons) return;

  // Loop through the NodeList of buttons
  buttons.forEach((button) => {
    // Get the postId
    const postId = button.dataset.postId;

    // Add click event listener
    button.addEventListener("click", (event) => {
      toggleComments(event, postId);
    });
  });

  return buttons;
};

/**
 * Removes the button listeners from all buttons inside the main element
 *
 * @function removeButtonListeners
 * @returns {NodeListOF<Element>} All buttons inside the main element
 * @requires toggleComments()
 */
const removeButtonListeners = () => {
  // Select all buttons inside the main element
  const buttons = document.querySelectorAll("main button");

  // Return if no buttons
  if (!buttons) return;

  // Loop through the NodeList of buttons
  buttons.forEach((button) => {
    // Get the postId
    const postId = button.dataset.id;

    // Remove the event listener
    button.removeEventListener("click", (event) => {
      toggleComments(event, postId);
    });
  });

  return buttons;
};

/**
 * Creates a document fragment containing all the comments from the JSON argument
 *
 * @function createComments
 * @param {JSON} commentData - JSON comments data
 * @returns {DocumentFragment} The generated fragment with all comments
 * @requires createElemWithText()
 */
const createComments = (commentData) => {
  // Return undefined if no parameter given
  if (!commentData) return undefined;

  // Create a fragment element
  const frag = document.createDocumentFragment();

  // Loop through the comments
  commentData.forEach((comment) => {
    // Create the article
    const article = document.createElement("article");

    // Create the article elements and append to the article
    const h3 = createElemWithText("h3", comment.name);
    const body = createElemWithText("p", comment.body);
    const from = createElemWithText("p", `From: ${comment.email}`);
    article.append(h3, body, from);

    // Append the article to the fragment
    frag.append(article);
  });

  // Return the fragment element
  return frag;
};

/**
 * Fills the select menu with options representing each blog user
 *
 * @function populateSelectMenu
 * @param {JSON} userData - JSON data representing the users of the blog
 * @returns {Element} The selectMenu element
 * @requires createSelectOptions()
 */
const populateSelectMenu = (userData) => {
  // Return undefined if no parameter passed
  if (!userData) return undefined;

  // Select the #selectMenu element by id
  const selectElement = document.querySelector("#selectMenu");

  // Pass the JSON data to createSelectOptions()
  const options = createSelectOptions(userData);

  // Loops through the options elements and appends each option to the select menu
  options.forEach((option) => {
    selectElement.append(option);
  });

  // Return the selectMenu element
  return selectElement;
};

/* 
NOTE: The next functions use Async / Await to request data from an API. We cover this in
Week 13. I do not recommend proceeding beyond this point until you have completed the
learning module for Week 13.
*/

/**
 * Gets JSON data for all users
 *
 * @async
 * @function getUsers
 * @returns {Promise<JSON>} JSON user data returned from site
 */
const getUsers = async () => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!res.ok) throw new Error("Status code not in 200-299 range");

    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

/**
 * Gets all posts by a specified user
 *
 * @async
 * @function getUserPosts
 * @param {String} userId - The user to fetch posts data for
 * @returns {Promise<JSON>} The JSON posts data for the specified user
 */
const getUserPosts = async (userId) => {
  if (!userId) return undefined;
  try {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
    );

    if (!res.ok) throw new Error("Status code not in 200-299 range");
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

/**
 * Gets all data for a specified user
 *
 * @async
 * @function getUser
 * @param {String} userId - The user to retrieve data for
 * @returns {Promise<JSON>} The JSON data returned for the specified user
 */
const getUser = async (userId) => {
  if (!userId) return undefined;
  try {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/users?id=${userId}`
    );

    if (!res.ok) throw new Error("Status code not in 200-299 range");

    // Make sure the user exists before accessing array
    let found = await res.json();
    if (found.length === 0) throw new Error("User not found");
    return found[0];
  } catch (error) {
    console.log(error);
  }
};

/**
 * Gets all comments for a specified post
 *
 * @async
 * @function getPostComments
 * @param {String} postId - The post for which to get comments
 * @returns {Promise<JSON>} The JSON data containing all comments for the given post
 */
const getPostComments = async (postId) => {
  if (!postId) return undefined;
  try {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
    );

    if (!res.ok) throw new Error("Status code not in 200-299 range");

    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

/* 
NOTE: The next functions will depend on the async API data functions we just created.
Therefore, these functions will also need to be async. When they call the API functions, they will
need to await data from those functions.
*/

/**
 * Creates a section element containing all comments for a specified post
 *
 * @async
 * @function displayComments
 * @param {String} postId - The post for which to display comments
 * @returns {Promise<HTMLElement>} The Section element containing the post comments
 * @requires getPostComments()
 * @requires createComments()
 */
const displayComments = async (postId) => {
  if (!postId) return undefined;

  const section = document.createElement("section");
  section.dataset.postId = postId;
  section.classList.add("comments", "hide");

  const comments = await getPostComments(postId);
  const fragment = createComments(comments);

  section.appendChild(fragment);
  return section;
};

/**
 * Creates a document fragment containing all posts within the specified JSON data
 *
 * @async
 * @function createPosts
 * @param {JSON} postsJSON - JSON data representing posts to create
 * @returns {DocumentFragment} The HTML for all posts within the given JSON data
 * @requires createElemWithText()
 * @requires getUser()
 * @requires displayComments()
 */
const createPosts = async (postsJSON) => {
  // Return early if undefined
  if (!postsJSON) return undefined;

  // Create the document fragment to contain all posts
  const fragment = document.createDocumentFragment();

  // Loop over each post
  for (let post of postsJSON) {
    // Create the post article element
    const article = document.createElement("article");

    // Create all post elements
    const h2 = createElemWithText("h2", post.title);
    const p_body = createElemWithText("p", post.body);
    const p_postId = createElemWithText("p", `Post ID: ${post.id}`);

    const author = await getUser(post.userId);
    const p_author = createElemWithText(
      "p",
      `Author: ${author.name} with ${author.company.name}`
    );
    const p_catchphrase = createElemWithText(
      "p",
      `${author.company.catchPhrase}`
    );

    const button = createElemWithText("button", "Show Comments");
    button.dataset.postId = post.id;

    const section = await displayComments(post.id);

    // Append all post elements to the post article
    article.append(
      h2,
      p_body,
      p_postId,
      p_author,
      p_catchphrase,
      button,
      section
    );

    // Append the article to the fragment containing all posts
    fragment.appendChild(article);
  }

  // Return the fragment containing all the posts
  return fragment;
};

/**
 * Creates posts from given JSON data and appends all to the document
 *
 * @async
 * @function displayPosts
 * @param {JSON} postsJSON - JSON data representing posts to create
 * @returns {HTMLElement | DocumentFragment} The posts created
 * @requires createPosts()
 * @requires createElemWithText()
 */
const displayPosts = async (postsJSON) => {
  // Select the main element of the document
  const main = document.querySelector("main");

  // Create the element for the posts
  let element;
  // If posts data was provided, create the posts from the JSON
  if (postsJSON) {
    element = await createPosts(postsJSON);
  }
  // Otherwise, create a default post
  else {
    element = createElemWithText(
      "p",
      "Select an Employee to display their posts."
    );
    element.classList.add("default-text");
  }
  // Append the posts to the document main element
  main.append(element);
  // Return the element appended to the document
  return element;
};

/* 
NOTE: This is the last group of functions. I call them “procedural functions” because they exist
to pull the other functions together in an order that allows the web app to function as it should.
This means their sole purpose is to call dependencies with the correct data in the proper order.
*/

/**
 * An event listener, toggles the comments for a specific post
 *
 * @function toggleComments
 * @param {Event} event - The event from a click event listener
 * @param {String} postId - The post for which to toggle comments
 * @returns {Element[]} An array containing the comment section element and the button element for the comments section
 * @requires toggleCommentSection()
 * @requires toggleCommentButton()
 */
const toggleComments = (event, postId) => {
  // Ensure that both the event and post id were provided
  if (!event || !postId) return undefined;

  // Toggle comments section and button
  event.target.listener = true;
  const section = toggleCommentSection(postId);
  const button = toggleCommentButton(postId);

  // Return the comment section and button
  return [section, button];
};

/**
 * Removes all posts from the page and adds all posts passed in as JSON
 * 
 * @async
 * @function refreshPosts
 * @param {JSON} postsJSON - posts JSON data
 * @returns {any[]} An array of the results from the functions called: [removeButtons, main,
fragment, addButtons]
 * @requires removeButtonListeners()
 * @requires deleteChildElements()
 * @requires displayPosts()
 * @requires addButtonListeners()
 */
const refreshPosts = async (postsJSON) => {
  // Return early if json not provided
  if (!postsJSON) return undefined;

  // Remove old posts
  const removeButtons = removeButtonListeners();
  let main = document.querySelector("main");
  main = deleteChildElements(main);

  // Create new posts
  const fragment = await displayPosts(postsJSON);
  const addButtons = addButtonListeners();

  // Return the results of the functions called
  return [removeButtons, main, fragment, addButtons];
};

/**
 * Event handler for the select menu
 *
 * @async
 * @function selectMenuChangeEventHandler
 * @param {Event} event - The event generated
 * @returns {any[]} An array with the userId, posts and the array returned from refreshPosts: [userId, posts, refreshPostsArray]
 * @requires getUserPosts()
 * @requires refreshPosts()
 */
const selectMenuChangeEventHandler = async (event) => {
  // User ID if contained in the event, or 1
  const userId = event?.target?.value || 1;

  // get posts JSON data
  const postsJSON = await getUserPosts(userId);

  // Refresh the posts
  const refreshPostsArray = await refreshPosts(postsJSON);

  // Return an array with the userId, posts and the array returned from refreshPosts: [userId, posts, refreshPostsArray]
  return [userId, postsJSON, refreshPostsArray];
};

/**
 * Initializes the page
 *
 * @async
 * @function initPage
 * @returns Return an array with users JSON data from getUsers and the select element result from populateSelectMenu: [users, select]
 * @requires getUsers()
 * @requires populateSelectMenu()
 */
const initPage = async () => {
  // Get users JSON data
  const usersJSON = await getUsers();
  // Populate the user select menu
  const select = populateSelectMenu(usersJSON);

  // Return an array with users JSON data from getUsers and the select element result from populateSelectMenu: [users, select]
  return [usersJSON, select];
};

/**
 * Initializes the blog app and sets the event listener on the select menu
 *
 * @function initApp
 * @requires initPage()
 * @requires selectMenuChangeEventHandler()
 */
const initApp = () => {
  // Initialize the page
  initPage();

  // Bind the select menu
  const select = document.getElementById("selectMenu");
  // Add an event listener to the select menu
  select.addEventListener(
    "change",
    (event) => selectMenuChangeEventHandler(event),
    false
  );
};

/* 
NOTE: There is one last step to get your app to function correctly. I cannot test for this, but you
must apply it to call the script into action.
*** This must be underneath the definition of initApp in your file.
1. Add an event listener to the document.
2. Listen for the “DOMContentLoaded” event.
3. Put initApp in the listener as the event handler function.
4. This will call initApp after the DOM content has loaded and your app will be started.
*/
document.addEventListener("DOMContentLoaded", initApp());
