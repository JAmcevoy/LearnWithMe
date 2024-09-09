# Learn with Me

Welcome to **Learn with Me**, the ultimate learning app designed to empower users by sharing and discovering knowledge. Whether you're a student, professional, or lifelong learner, this app is your go-to platform for mastering new skills and expanding your horizons.

## What is *Learn with Me*?

*Learn with Me* is more than just a learning tool—it's a vibrant community where you can:

- **Share Your Wisdom:** Post your own tips, tricks, and insights to help others learn more effectively.
- **Discover New Ideas:** Browse and interact with posts from fellow users to gain fresh perspectives and innovative techniques.
- **Connect and Collaborate:** Join discussions and chat with people who share your interests, fostering a collaborative learning environment.

## Planning

- **Home/Feed**: 
  - This page will display a list of different users' posts.
  - It will serve as the main/home page. Starting here helps set a standard design for the rest of the app.
  - Consider a unique approach for the navbar: use a side component for navigation on larger screens, while maintaining a standard mobile navbar for smaller screens.

- **Profile**:
  - This page will show the current user's profile information.
  - It will include recent posts, recent likes, and counts for followers and following.
  - Aim to consolidate all necessary user information and relevant actions in one place.

- **Interest Circles**:
  - This page will act as a groups component, bringing users with similar interests together.
  - The design should be straightforward and aligned with the 'Circles' concept to ensure clarity and usability.

- **Chats**:
  - This will be a sub-page of Interest Circles, where users can read messages posted by others in the circle.
  - Keep the design simple and user-friendly, consistent with common social media chat interfaces.

#### Design

##### Home/Feed

- Start with this page to set the standard for the app's design.
- Consider incorporating a side navigation component for larger screens, while ensuring compatibility with standard mobile navigation.
  
  ![Wireframe - Feed](docs/images/home-page-wirframe.JPG)

##### Profile

- Design to include essential user information and recent activities, such as posts and likes.
- Ensure easy access to profile management, privacy settings, and activity logs.
  
  ![Wireframe - Profile](docs/images/profile-wirframe.PNG)

##### Interest Circles

- Focus on clarity and ease of use for navigating and interacting with interest circles.
- Design should emphasize community and make it simple to join or view different circles.
  
  ![Wireframe - Interest Circles](docs/images/interest-circle-wirframe.PNG)

##### Chats

- Keep the chat page straightforward, focusing on user conversations.
- Consider features like message search, reactions, or pinned messages if applicable.
  
  ![Wireframe - Chats](docs/images/chats-wirframe.PNG)


#### Logic

- Using an online tool I was able to map out my database and get a better idea of what relationships were present between tables

![Database Schema](docs/images/database-schema.PNG)

#### User Stories

##### Backend

1. **Profile Model**
   - **Issue #2**
2. **Post Model**
   - **Issue #3**
3. **Messages Model**
   - **Issue #4**  
4. **Circles Model**
   - **Issue #5**
5. **Like Model**
   - **Issue #6**
6. **CRUD Operations for Posts API**
   - **Issue #7**
7. **CRUD Operations for Messages API**
   - **Issue #8**
8. **CRUD Operations for Circles API**
   - **Issue #9**
9. **CRUD Operations for User Profiles API**
   - **Issue #10**
10. **User Registration**
    - **Issue #11**
11. **User Login API**
    - **Issue #12**
12. **Filter Posts by Categories API**
    - **Issue #14**
13. **Pagination for Feeds API**
    - **Issue #15**
14. **Pagination for Groups API**
    - **Issue #16**
15. **Followers Model**
    - **Issue #17**



##### Frontend

1. **Reusable Components**
   - **Issue #1**  
2. **State Management**
   - **Issue #2**  
3. **Routing**
   - **Issue #3**
4. **Forms and Validation**
   - **Issue #4**  
5. **Media Handling**
   - **Issue #5**  
6. **Infinite Scroll**
   - **Issue #6**  
7. **View Profile Page**
   - **Issue #7**  
8. **View Interest Circles**
   - **Issue #8**  
9. **View Chats**
   - **Issue #9**  
10. **Create a Post**
    - **Issue #11**  
11. **Follow Profile**
    - **Issue #12**  
12. **Pagination for Feeds API**
    - **Issue #13**


## Existing Features

- **Sidebar/Navigation Bar**
  - The Sidebar replaces the previous Navigation Bar.
  - The Sidebar displays different icons based on your authentication status:
    - **Logged In**: Home, Interest Circles, Create a Post, Profile Icon, Log Out icon.
    - **Logged Out**: Home, Sign In, Sign Up.
  - The Sidebar is collapsible; even when closed, the icons remain functional as links, so users don't need to expand the Sidebar to change pages.

  ![Logged In]()
  ![Logged Out]()

- **Feed Page**
  - The Feed Page is the landing page for users accessing the app.
  - It displays a list of post cards, with each card linking to the post details page via the post name.
  - Logged-in users can view the post owner's profile page by clicking on the top of the card.
  - Logged-in users can also like posts directly from the Feed Page. Liked posts will display as "Unliked" with a blue color to indicate their status.

  ![Feed Page]()
  ![Post Card]()
  ![Like Button]()

- **Profile Page**
  - The Profile Page displays the user's personal information:
    - Profile Name
    - Profile Picture
    - About Me
    - Follower Count
    - Following Count
    - Depending on whether the user owns the profile:
      - If the owner: Edit Button
      - If not the owner: Follow/Unfollow Button
    - Users can search through their previous posts, sorted by most recent first.
    - The Recent Likes section shows the user's last 10 likes.

  ![Profile Page]()

- **Interest Circles Page**
  - The Interest Circles Page is designed for clarity.
  - Each circle displays the interest name, owner, and an info button that shows the circle's description when clicked.
  - If the logged-in user owns the circle, they have the option to delete or edit the circle via a modal.

  ![Interest Circles]()
  ![Circle Edit Modal]()

- **Chat Page**
  - The Chat Page features a simple message interface with a white background for readability.
  - Messages are displayed in a list, starting with the most recent messages at the top. Users can scroll back through older messages.
  - Message owners have edit and delete icons on their messages. Selecting "Edit" allows them to modify their message directly in the input field below, removing the need for a modal and making the process more seamless.

  ![Chats]()
  ![Edit/Delete]()
  ![Edit Message]()

- **Error Modal**
  - The Error Modal handles various errors across different pages.

  ![Error Modal]()

- **Delete Modal**
  - The Delete Modal is used for handling deletions across multiple pages.

  ![Delete Modal]()

- **Sign In Page**
  - I wanted the Sign In process to be quick and easy so I just went with a standard login card but to make it easier for people I added a Show/Hide button for password so User can check for any password errors before subbmitting the login.

  ![Sign In]()
  ![Show Passoword]()

- **SignUp Page**
  - Allows new users to create an account by entering a username and password.
  - Simple and clean form layout for ease of use and clear focus on registration.
  - Ensures passwords match before submission, providing immediate feedback.

  ![Sign Up Page]()


## Features Left to Implement

- List any planned features that have not yet been implemented.

## Testing

- **Browser Testing**
  - List the browsers tested and the results of the testing.

- **Responsiveness**
  - Explain how responsiveness was tested and the tools used.

- **Form Validation**
  - Detail the testing and results of form validation.

### Validator Testing

- **HTML**
  - Provide a link to the HTML validation results.

- **CSS**
  - Provide a link to the CSS validation results.

- **Js**
  - Provide a link to the Js validation results.

- **Python**
  - Provide a link to the Python validation results.

### Bugs Faced

- Describe any bugs encountered during development and how they were addressed.

### Bugs Yet to Fix

- List any unresolved issues and potential plans for addressing them.

## Deployment

**API Deployment**
**Github**
**Heroku**

## Credits

### Code

- List any resources or references used for code.

### Content

- The wirframes for this project were created with [Wirframe](https://wireframe.cc/)
- Database Schema was created using [Database Schema](https://dbdiagram.io/)

### Media

- Provide credits for any media (images, videos, etc.) used in the project.
