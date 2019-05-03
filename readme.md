# Drinkit

is a reddit inspired cocktail recipe book application. It is a platform for mixologists and cocktail enthusiasts to share and discuss their favorite cocktail recipes. 

This project uses mongodb to store and manageuser accounts and cocktail information. The App is served using the flask framework.

[Drinkit is hosted here](http://drink-it.herokuapp.com/)

## UX - The Idea
This project is the result of two idea's mashed together. When i first thought about making a data-driven web app my very first thought was simply (I say simply....) a clone of reddit. No other web app that I can think of handles such a varied array of user driven content so simply intuitvely. At the same time I was prototyping a recipe book app using a tinder inspired interface, i.e. based on preferences it would show a user reciepes, that they could swipe left or right on, I thought this was quite a fun idea, but lacked the user driven content that a data-driven app really needed. So from these two ideas drinkit (working title) was born. 

With Drinkit the idea is to offer the ease of use and simple content delivery of reddit but focused into a specific area (i.e. cocktails). Through regular use of the app users will be able to add more preferences (favorite flavors, ingredients, cocktails) that will allow the app to suggest cocktails that they might like.

Another important aspect of drinkit is to develop a sense of community for the users, to aid this I intend to implement a user rating system based on upvotes and downvotes of cocktails, and comments.


## UX - User Stories

Viewing Cocktails  (anybody):

* As a registered or unregistered user I should be able to view a list of the most popular cocktails (most upvotes).

* As a registered or unregistered user i should be able to filter and view cocktails based on ingredients.

* As a registered or unregistered user i should be able to filter and view cocktails based on flavour.

* As a registered or unregistered user i should be able view a random cocktail.

* As a registered or unregistered user I should be able to view a list of the most recently added cocktails.

* As a registered or unregistered user I should be able to search for a user and see all the cocktails they have submitted.

* As a registered or unregistered user i should be able to select a cocktail to view full information about it.
   * By selecting a cocktail i should see full information about a cocktails
   * As a registered user if i view a cocktail there should be an option to remix the cocktail (see below)
   * As a registered user i should be able to leave a comment on a cocktail.

* As a registered user when viewing a cocktail I should be able to suggest variations of that cocktail (remix).

* As a bartendr user I should be able to upvote or downvote cocktails.

* As a bartender user I should be able to flag any cocktails that are innapropriate - offensive, dangerous, trollinng.
 

Users(anybody, registered users):

* As an unregistered user i should be able to register with drinkit
   
* As a registered user i should be able to login to drinkit

* As a registered user i should be able to add drinks to my favorites

* As a registered user I should be able to add ingredients to my favorite ingredients

* As a registered user I should be able to add flavors to my favorite flavors
 
* As a registered user I should be able to see all my preferences

* As a registered user I should see a personalised list of cocktails when i log in.


Submitting Cocktails (Registered users):

* As a registered user I should be able to submit a new cocktails to the database.

* As the createor of a cocktail I should be able to edit the recipe.

* As the creator of a cocktail I should be able to remove it from the database.



#### Social/comments(Registered users):

* As a registered user i should be able to leave a comment on peoples cocktails.

* As a registered user I should be able to leave a comment on people comments.

* As a registered user I should be able to upvote or downvote comments.

* As a registered user i should be able to flag a comment as innapropriate.

## UX - Scope

### Functional Requirements
1. 

## UX - Structure

## UX - Skeleton

## UX - Surface

## Features

### Existing Features

### Desirable Features


## Technology Used


## Testing

### Interesting Bugs & Fixes

#### Bug 1: Adding a drink with no flavor tags causes it to fail to render in the app: 
**Status**: Identified
This bug stems from an outdated instruction on the input form. Users were asked to input a comma separated list of tags. This interface was changed to generate new tags when the user pressed enter. By not adding tags in this way a number of cocktails were added with no flavor descriptors.

When the aggregate query is performed, it filters out query results that have no flavor tags. Resulting in a number of cocktails being in the database, but never being rendered on the index page.

**Solution**: The large aggregate query that was filtering out cocktails was also causing problems with loading times (it took upwards of 3 seconds to complete on a small dataset). Therefore method of aggregation was changed. The cocktails collection is queried on the server and sent with the index. AJAX is then used to asynchronusly perform the aggregation (adding flavor, user and ingredient information) after the index page as been index page has been loaded. 

## Deployment

## Credits

