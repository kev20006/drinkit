# Drinkit

is a reddit inspired cocktail recipe book application. It is a platform for mixologists and cocktail enthusiasts to share and discuss their favorite cocktail recipes.

This project uses mongodb to store and manageuser accounts and cocktail information. The App is served using the flask framework.

[Drinkit is hosted here](http://drink-it.herokuapp.com/)

## UX - The Idea

This project is the result of two idea's mashed together. When I first thought about making a data-driven web app my very first thought was simply (I say simply....) a clone of reddit. No other web app that I can think of handles such a varied array of user driven content so simply intuitvely. At the same time I was prototyping a recipe book app using a tinder inspired interface, i.e. based on preferences it would show a user reciepes, that they could swipe left or right on, I thought this was quite a fun idea, but lacked the user driven content that a data-driven app really needed. So from these two ideas drinkit (working title) was born.

With Drinkit the idea is to offer the ease of use and simple content delivery of reddit but focused into a specific area (i.e. cocktails). Through regular use of the app users will be able to add more preferences (favorite flavors, ingredients, cocktails) that will allow the app to suggest cocktails that they might like.

Another important aspect of drinkit is to develop a sense of community for the users, to aid this I intend to implement a user rating system based on upvotes and downvotes of cocktails, and comments.

## UX - User Stories

**Viewing Cocktails (anybody)**:

1. As a registered or unregistered user I should be able to view a list of the most popular cocktails (most upvotes).

2. As a registered or unregistered user I should be able to filter and view cocktails based on ingredients.

3. As a registered or unregistered user I should be able to filter and view cocktails based on flavour.

4. As a registered or unregistered user I should be able view a random cocktail.

5. As a registered or unregistered user I should be able to view a list of the most recently added cocktails.

6. As a registered or unregistered user I should be able to search for a user and see all the cocktails they have submitted.

7. As a registered or unregistered user I should be able to select a cocktail to view full information about it.

   7.1 By selecting a cocktail I should see full information about a cocktails
   7.2 As a registered user I should be able to leave a comment on a cocktail.

8. As a registered or unregistered user I should be able to upvote or downvote cocktails.

**Users(anybody, registered users)**:

9. As an unregistered user I should be able to register with drinkit
10. As a registered user I should be able to login to drinkit

11. As a registered user I should be able to add drinks to my favorites

12. As a registered user I should be able to add ingredients to my favorite ingredients

13. As a registered user I should be able to add flavors to my favorite flavors

14. As a registered user I should be able to see all my preferences

**Submitting Cocktails (Registered users)**:

1. As a registered user I should be able to submit a new cocktails to the database.

2. As the createor of a cocktail I should be able to edit the recipe.

3. As the creator of a cocktail I should be able to remove it from the database.

#### Social/comments(Registered users):

1. As a registered user I should be able to leave a comment on other users cocktails.

2. As a registered user I should be able to leave a comment on users comments.

3. As a registered user I should be able to upvote or downvote comments.

## UX - Scope

### Functional Requirements

1. The Application must have a persistant data store accessible by multiple users simulataneously
2. The Application must differentiate between registered and unregistered users
3. Users must be able to add content to the database without directly interfacing with the database itself.
4. All data sent to the server should be validated such that it prevents XSS or SQL Injection

## UX - Structure

## UX - Skeleton

## UX - Surface

## Features

### Existing Features

- **User Accounts**: Each user can create a unique account with a secure encrypted and salted password.

- **Add or Edit Cocktails**: Registered users can add and edit cocktails to the database and they will be immediately available visible for other users on the app. The creator of a cocktail can also edit cocktails that they have posted.

- **Upvote and Downvote**: Users can upvote and downvote cocktails, id's are stored with upvotes and downvotes so that each user can only up or downvote a cocktail once.

- **Favorites**: Users can mark drinks or ingredients as their favorites, they can then quickly search by their favorite flavors/ingredient or alternatively quickly jump to view details about their favorite cocktails

- **Comments**: Registered users can comment on other users creations, additionally users can reply to, upvote or downvote comments.

- **Responsive design**: The page design rearranges itself on large and small devices to allow the best user experience for each of these devices.

### Desirable Features

In the future I would like to improve on the potential of the site as a social platform
(A number of these features were planned, but due to time constraints had to be cut)

- **Direct Messaging**: Users should be able to send each other Direct Message.

- **Follow a User**: If a user likes another users submissions they should be able to follow them and see when they add new cocktails to the site.

- **Updates**: When a user logs in, they should be able to see if anybody has liked one of their cocktails or added a comment to one of their cocktails.

- **Remix a Cocktail**: If users had a variation of a cocktail, that was already added to the database, they could suggest a remix.

- **Favored Spirits**: Some cocktails jsut taste better with a specfic brand of spirit, I would like to extend the database to also store specfic spirits

## Technology Used

On the frontend the App uses:

- Jinja Templates
- SCSS
- Bootstrap 4
- Jquery (included for bootstrap only)
- fontawesome 4

On the backend the App uses:

- Python
- Flask
- sha256_crypt - for encrypting user passwords
- Pymongo to interface with mongo DB

The data is stored using

- Mongo DB
- Hosted on Mongo Atlas

## Testing

### Automated Testing

Automated testing has been added in the ./tests folder, and can be run using pythons unit test.

```
python3 run - put actual code here
```

Tests have been included for following:

- URL GET Routes - to test if pages are being served correctly.
- API Routes - to test if API routes are serving the correct json files
- Utils - to test if pure functions are returning expected values.

**problem:**

I could not figure out mocking a database, so failed to automate tests for that, Post Methods were tested manually.

Additionally Jasmine has been used to unittest the js pure functions.

### Manual Testing

I tested each of the user stories on:
Laptop - Elementary OS. (elementary OS is built on Ubuntu 18)

- Google Chrome
- Firefox

Desktop - Windows 10

- Microsoft Edge
- Chrome

Samsung A7 (2017) - Android

- Chrome

### User Stories Tests:

#### Searching for and viewing cocktails

**1. View Most Popular**

On all devices - control to do this was not in a particularly intuitive place. - redesigned moved this to make it easier to use.



**2. Filter based on ingredients**

Ingredients menu was too long and unweildly, quick filter is now only done by spirit, as user feddback suggested that people don't tend to search for cocktails by garnish or mixer.

**3. Filter based on flavors**

Works as expected

**4. Random cocktail**
Not implemented at first round of testing.

**5. Most Recent Cocktails**
This is the default option for searching and for the homepage. Control to manually do this moved - see **2.**

**6. Search by user**
This functionality has been added into user profiles, search results will return users, selecting a user will show all the cocktails they have submitted.

**7. View Cocktail Details**

Cocktails can be viewed - users feedback stated that from this menu there was no way to favorite a cocktail from this page - this is unintuitive.

As of first round of testing there is no limitation on who can leave comments. - user feedback also indicated that once a comment has been added, the new comment should be focued in the browser to provide meaningful feedback.

**8. Upvote and Downvote**

Works as expected

**9. Register**

Users were getting no feedback when the app failed to register them, updated to register route to return JSON on a failed signup as well.

**10. Login**

Users were getting no meaningful feedback at all on a failed, or successful login.

Updated to return JSON success or failure - to allow the app to indicate whether or not the login was successful.

**11. 12. 13. Favorites**

Works as expected in the database, minor bug identified. See Bug 4 Below.

As of first round of testing there was no way to view favorites on mobiles devices - added favorites and starred cocktails to the hamburger menu

**14. User Preferences**

This information is not displayed as of first round of testing.

#### Submitting Cocktails

**1. Add New Cocktail**

**2. Edit Cocktail**

**3. Delete Cocktail**

Works as expected - user feedback identified that this action was too easy to do, and had no validation in the event of a misclick.

Modal added to confirm deletion.

#### Comments

**1. Comment on cocktails**

Works as expected - as mentioned above user feedback identified that it wasn't obvious when a comment was added, updated to focus the browser window on new comments

**2. Comment on Comment**

Works as expected

**3. Upvote and Downvote Comments**

Works as expected

## Interesting Bugs & Fixes

#### Bug 1: Adding a drink with no flavor tags causes it to fail to render in the app:

**Status**: fixed

This bug stems from an outdated instruction on the input form. Users were asked to input a comma separated list of tags. This interface was changed to generate new tags when the user pressed enter. By not adding tags in this way a number of cocktails were added with no flavor descriptors.

When the aggregate query is performed, it filters out query results that have no flavor tags. Resulting in a number of cocktails being in the database, but never being rendered on the index page.

**Solution**: The Aggregate Query was removing results where it found empty arrays for either the flavors or for the ingredients. Added preserveNullAndEmptyArrays parameter to the unwind stage of the aggregate query.

#### Bug 2: App is very slow to load index page and search results:

**Status**: identified

The large aggregate query that was filtering out cocktails was also causing problems with loading times (it took upwards of 3 seconds to complete on a small dataset - this could only get exponentially worse). Each cocktail preview is making 4 calls to the database, querying cocktails, looking up flavors, looking up ingredients, looking up users.

**Solution**: Planned change to the implementation of the initial query and aggregating results

#### Bug 3: App is taking quite a while to load all page elements from partial page loads.

**Status**: identified

Lots of content on the app, cocktail names in the sidebar, search and filter lists, favorites are taking a long time to load. Leaving users essentially stuck in the homepage for a few seconds.

**Solution**: Tidy up the API calls, many items are being called more than once, all of these could be condensed into a single api call. Cacheing may be implemented to further speed this up.

#### Bug 4: Favorites were not updating until page refresh.

**Status**: Fixed

When the user added an ingredient, flavor or cocktail to their favorites, it did not display in the favorites menus until the page was reloaded.

**Solution**: Everything was working as expected on in the database and on the backend, however, the DOM was not updated to reflect this new state until the page was reloaded. Updated the add remove favorites and starred cocktails js to also add or remove favorites to the corresponding locations in the DOM, to reflect this new state.

## Deployment

The App was deployed on Heroku using a pipeline from the github repo, and has been configure to build on Heroku whenever the master branch in updated.

To deploy your own version of the application

ensure that you have python 3 and pip installed and up to date.

Copy or clone the file from github

install all the dependencies from requirements.txt

Create a Mongo DB database skeleton with collections named as follows:

- users
- cocktails
- ingredients
- flavors

Using .env.sample create a .env file.

from the project route directory run

python3 app.py

## Credits

This app was inspired initially by Reddit, and whilst it has seen some changes since then, elements of that are still present.

The lovely people of the Code Institute - DCD Project Slack Channel for contributiing cocktails to the application, and for pointing out some glaring bugs that i missed.

All images and associated copyrights belong to their original creators.
