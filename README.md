# Dice Roller

client: https://roll-dice-game-client.herokuapp.com

## Overview

This is a dice rolling web application. It consists of a client and a server. This client provides the interface for the user to login/register for their account and play the dice rolling game. The server provides the dice rolling results to the user and it maintains user information in a MySQL database including login information and highscore information(all-time highscore and the daily highscore). 

## Possible Future Improvements
### Multiple Dice counts
Only 3 dice are used in the game. The client is written so that it could dynamically expand to support more dice and the server endpoints support multiple sided dice. The database scheme currently only keeps track of the all-time highscore and daily score for a 3 dice count but it could be expanded to support different dice counts by adding a "dice count" column to the score database table.
### Multiple Sided Dice
Only 6 sided dice are used in the game. The server endpoints support n-sided dice but the client and database do not. The client uses images of 6 sided dice but could be updated with more dice type images. The database could be updated similarly to adding more dice as described above by adding a new column in the score table for "dice sides".
### Adaptive Client
The current styling for the client application is designed for a desktop browser environment. The styling and page layout could be updated to better support mobile platforms.
### Security Concerns
Since this more of a prototype rather than a production application, there are very few measures taken to address any security concerns for user information or endpoint robustness.
