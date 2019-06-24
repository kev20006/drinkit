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
As a registered or unregistered user I should be able to view a list of the most popular cocktails (most upvotes).

As a registered or unregistered user I should be able to filter and view cocktails based on ingredients.

As a registered or unregistered user I should be able to filter and view cocktails based on flavour.

As a registered or unregistered user I should be able view a random cocktail.

As a registered or unregistered user I should be able to view a list of the most recently added cocktails.

- As a registered or unregistered user I should be able to search for a user and see all the cocktails they have submitted.

- As a registered or unregistered user I should be able to select a cocktail to view full information about it.

  - By selecting a cocktail I should see full information about a cocktails
  - As a registered user if I view a cocktail there should be an option to remix the cocktail (see below)
  - As a registered user I should be able to leave a comment on a cocktail.

- As a registered or unregistered user I should be able to upvote or downvote cocktails.

**Users(anybody, registered users)**:

- As an unregistered user I should be able to register with drinkit
- As a registered user I should be able to login to drinkit

- As a registered user I should be able to add drinks to my favorites

- As a registered user I should be able to add ingredients to my favorite ingredients

- As a registered user I should be able to add flavors to my favorite flavors

- As a registered user I should be able to see all my preferences

**Submitting Cocktails (Registered users)**:

- As a registered user I should be able to submit a new cocktails to the database.

- As the createor of a cocktail I should be able to edit the recipe.

- As the creator of a cocktail I should be able to remove it from the database.

#### Social/comments(Registered users):

- As a registered user I should be able to leave a comment on other users cocktails.

- As a registered user I should be able to leave a comment on users comments.

- As a registered user I should be able to upvote or downvote comments.

## UX - Scope

### Functional Requirements

1.

## UX - Structure

## UX - Skeleton

## UX - Surface

## Features

### Existing Features

### Desirable Features

In the future I would like to improve on the potential of the site as a social platform
(A number of these features were planned, but due to time constraints had to be cut)

- **Direct Messaging**: Users should be able to send each other Direct Message.

- **Follow a User**: If a user likes another users submissions they should be able to follow them and see when they add new cocktails to the site.

- **Updates**: When a user logs in, they should be able to see if anybody has liked one of their cocktails or added a comment to one of their cocktails.

## Technology Used

On the frontend the App uses:

- Jinja Templates
- SCSS
- Bootstrap 4
- Jquery

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

**problem:** I could not figure out mocking a database, so failed to automate tests for that, Post Methods were tested manually.

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

### Interesting Bugs & Fixes

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
