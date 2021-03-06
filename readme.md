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
5. Users actions must feel meaningful and provide suitable feedback.
6. The app should be responsive and work equally well on all devices including:
   * mobiles
   * tablets
   * laptops
   * desktops - up to 4K resolution
7. Users should be able to search the database, and filter search results in meaningful ways
8. The app should work in all browser.

### Functional Requirements

1. The App should be intuitive and easy to use
2. The App should be eye-catching yet easy to read


### Content Requirements

1. All content should be user submitted and therefore appropriately validated and verified
2. Content should persist through database changes, i.e. if a user deletes their account, all their cocktails shouldn't be deleted with them. 

## UX - Structure

The site is stuctured such that is has 3 main views with a persistant navigation bar that allows users to perform most core functionality at any point throughout the add

When the uses land on the site they will be displayed with a stream of cocktail cards in a similar fashion to sites like reddit or social media sites - showing the most recently added cocktails first (this can be changed to show the highest rated cocktails first instead), on larger screens a side menu will display key information about the site, user preferences and a a register button / login and some other app controls for registered users.

This same view is used for rendering the results of filters.

To add or edit a cocktail a full page form is displayed in a new view. This form is split into sections, a details section, an ingredients and equipment section and a method section. To not overwhelm the user, ingredient and method fields should be added dynamically as the user needs them.

Viewing a cocktail renders a third view that displays the cocktails information in the same groups as in the add/edit, but fields are uneditable in this view.

The final view is the user profile. User profiles show an optional picture of the user along with a short bio, as well as a list of all the cocktails that the user has submit.

In regard to the order of information on the page. As is conventional the left of the navbar has the logo, which links back to the index. I felt that the when most people are looking for cocktails the most important consideration is what alcohol is in it, so immediately after the logo is a quick filter to allow users to filter the database by spirit. On the right hand of the navbar are more advanced controls, a detailed filter and search (the search function users usernames, cocktail names, flavors and ingredients simulataneously to reduce additional menus), after those options are login /logout and a link to the users own profile assuming if they are logged in, whilst not the most important part of the site, i felt that displaying the username and link here in the nav bar allows the user to determine if they are logged in at a glance.

On mobile login, profiles are hidden behind a hamburger menu, along with controls to add new cocktails, view random cocktail and manage favorites and starred cocktails. On larger screens these options are displayed in a sticky side menu.

## UX - Skeleton

All main interface elements will be rendered as cards, that will be display in a vertical stream from top to bottom. Originally this stream was going to use infinite scrolling and render more cards as a user scrolled to the bottom of the page, but this was scrapped because of performance issues and instead cards are rendered 5 per page.

To keep the ui clean the navbar hides iteself on scroll down and unhides whenever the user scrolls up.

Cards differentiate a little between screen layouts, small screens render a vertical cards where all details run from top to bottom, whereas larger screens display the image on the left and render the card details on the right.

Attached in the this repo in the **name folder here**

Wireframes are evaluated against final production version here

### Wireframes

All wireframes can be found in the documentation folder.

However an analysis of the wireframe can also be found [here](https://github.com/kev20006/drinkit/blob/master/documentation/Drinkit%20Wireframes.pdf)

## UX - Surface

I had intially opted for a very plain UI, comprising of mostly default bootstrap components, however, when browsing other cocktail sites, to get ideas for reciepes i noticed that many of them were quite visually striking. I was particularly taken by the Brutalist design of [Esquire](https://www.esquire.com/food-drink/) - and took some key design points from that along with other brutalist sites like [dev.to](https://dev.to/)

### Colors
I chose blue and hotpink for my main colors as they are both striking and eye catching colours, but also strongly contrast, whih creates a nice aesthetic. For most interface elements i chose to use heavy borders as opposed to more subtle drop shadows to give the whole site a retro feel. The color scheme compined with the overlapping content creates a very retro 1990's feel, which should resonate with most people who are old enough to enjoy cocktails.

### Iteractions
All clickable links underline when they are hovered, again this is a throwback to websites of yesteryear when all hyperlinks were blue and underlined.

Interactions on the page that send requests to the server all display a loading spinner while the are waiting for a response from the server.

## Data

The data in the backend uses a NoSQL database, whilst noSQL doesn't enfore a strict schema, I tried to stick to the following as closely as possible
![alt text](https://github.com/kev20006/drinkit/blob/master/documentation/Schema.PNG "database schema")

### Cocktails
The cocktails document contains all the user submitted cocktails in the database, most of this should be self explanatory. However a couple of points are worth mentioning. 
votes are an array of user ids, whilst this consumes more space than just having an incrementing value, it prevents users from spam upvoting their own cocktails, or review bombing others.
#### Sample Cocktail JSON
```
{
   "_id":{"$oid":"5c8d09761c9d44000012beea"},
   "name":"dark and stormy",
   "description":"The Dark and Stormy is a drink that came to be in the Caribbean waters, where rum is plentiful and so are sailors. It’s a drink that was spit out by the sea, more or less. It’s a drink with a really cool name.",
   "flavor_tags":[
      {"$oid":"5c9b05761c9d440000b3a3d1"},
      {"$oid":"5c9b05e51c9d440000a1d0cf"},
      {"$oid":"5cb60f63fc7d4000044adaca"}
   ],
   "ingredients":[
      {
         "ingredient":{"$oid":"5c9a42f11c9d440000cde72c"},
         "quantity":"2",
         "units":"oz",
         "type":"spirit"
      },
      {
         "ingredient": {"$oid":"5c9a44bb1c9d440000cde72e"},
         "quantity":"0.5",
         "units":"oz",
         "type":"mixer"
      },
      {
         "ingredient":{"$oid":"5c9a44fc1c9d440000cde72f"},
         "quantity":"3",
         "units":"oz",
         "type":"mixer"
      },
      {
         "ingredient":{"$oid":"5c9a45281c9d440000cde730"},
         "quantity":"1",
         "units":"slice",
         "type":"garnish"
      }
   ],
   "votes":{
      "downvotes":[],
      "upvotes":[
         "5cab8f5907130600048685c4",
         "5cad97ca7589b90004319321",
         "5ca4ba55ec4ad1038c0c2ba1"
       ]
   },
   "method":[
      "Fill Glass With Ice",
      "Add Rum",
      "Add Ginger Beer",
      "(Optional) Add Lime Juice",
      "Garnish With Lime"],
   "glass":"highball",
   "equipment":[],
   "creator":{"$oid":"5ca4ba55ec4ad1038c0c2ba1"},
   "flagged":{"$numberInt":"0"},
   "created_at":"2019-03-27 09:04:53.259622",
   "updated_at":"2019-06-26 09:26:31.045229",
   "image_url":"https://cdn.liquor.com/wp-content/uploads/2017/11/22150958/dark-n-stormy-720x720-recipe.jpg"
}
```

### Users
By default a user doesn't have a profile pic or a bio, however these will be added to the document if the user creates a profile.
starred cocktails and favorites are simply arrays of cocktail or flavor ids that link them to the corresponding documents in the cocktails colleciton

#### sample JSON
```
{
   "_id":{"$oid":"5d1ae298c2755621a137192b"},
   "username":"flobbins",
   "passhash":result of sha_256 encryption
   "date_joined":"2019-07-02 11:50:32.175767",
   "starred_cocktails":[{"$oid":"5cacb7e6ec4ad1236c11911d"},{"$oid":"5d1b585806e536000485d60b"}],
   "favorite_ingredients":[{"$oid":"5c9a45281c9d440000cde730"},{"$oid":"5cab524eec4ad12098cc2807"}],
   "favorite_flavors":[{"$oid":"5c9b05761c9d440000b3a3d1"},{"$oid":"5cab524dec4ad12098cc2805"}],
   "bio":"dfgdfgs",
   "profile_pic":"http://custom-gwent.com/cardsBg/1104730b3c4a83f3c8bcd13c97caccb0.jpeg"
}
```
#### Ingredients and Flavors
These collections are essentially the same. they are primarily used for filtering and searching more efficiently without the need for text matching.

#### sample JSON
```
{"_id":{"$oid":"5c9a44bb1c9d440000cde72e"},"name":"ginger beer","type":"mixer"}
{"_id":{"$oid":"5cab524cec4ad12098cc2801"},"name":"breakfast"}
```


#### Comments
Each comment is stored as a document, each comment is associated with a cocktail, as these are the only things that can recieve comments at this stage. Additionally if a comment has a parent, the parent document is referenced. In a similar way to how votes are tracked for each cocktail, each comment maintains an array of who has upvoted it and downvoted it.

#### sample JSON
```
{
   "_id":{"$oid":"5cb89455ec4ad1376049f575"},
   "user_id":{"$oid":"5ca4ba55ec4ad1038c0c2ba1"},
   "parent":"",
   "cocktail_id":{"$oid":"5cb640dfab711700046834ad"},
   "comment":"test comment",
   "votes":{
      "upvotes":["5ca4ba55ec4ad1038c0c2ba1","5cbde439031094000425b301"],
      "downvotes":[]
      },
   "reported":{"$numberInt":"0"},
   "created_at":"2019-04-18 22:14:29.420542"
}
```


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
python -m unittest -v
```

Tests have been included for following:

- URL GET Routes - to test if pages are being served correctly.

**problem:**

I could not figure out mocking a database, so failed to automate tests for that, Post Methods were tested manually.

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

**Status**: fixed

The large aggregate query that was filtering out cocktails was also causing problems with loading times (it took upwards of 3 seconds to complete on a small dataset - this could only get exponentially worse). Each cocktail preview is making 4 calls to the database, querying cocktails, looking up flavors, looking up ingredients, looking up users.

**Solution**: Aggregate query was removed, core information for page load is render, and additional supplemental information is done with api calls and loaded onto the page when ready, they combined with the solution for the next bug greatly improved load time

#### Bug 3: App is taking quite a while to load all page elements from partial page loads.

**Status**: identified

Lots of content on the app, cocktail names in the sidebar, search and filter lists, favorites are taking a long time to load. Leaving users essentially stuck in the homepage for a few seconds.

**Solution**: Tidy up the API calls, many items are being called more than once, all of these could be condensed into a single api call. Cacheing may be implemented to further speed this up.

**Solution Revisited**: API calls were grouped together, so that each collection is only called at most once per page.

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

You will need to create the following enviroment variables:

**DBS_NAME**: This is a string that contains the name of your database
**MONGO_URI**: This is a string that contains the URI of your mongo DB
n.b. if you want to use another noSQL db some extra config will be required
**SECRET_KEY**: this is the secret key used for sha_crypt_256
**VERSION**: version does not need to be included in your dev environment, but if you are launchin a production version this variable must be set to **"PROD"** to disable the dev server

From the project route directory run

python3 app.py

## Credits

This app was inspired initially by Reddit, and whilst it has seen some changes since then, elements of that are still present.

The lovely people of the Code Institute - DCD Project Slack Channel for contributiing cocktails to the application, and for pointing out some glaring bugs that i missed.

All images and associated copyrights belong to their original creators.
