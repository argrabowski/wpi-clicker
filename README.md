# WPI Clicker

## What is WPI Clicker?

WPI Clicker is an incremental game built as a web application. It involves the simple task of clicking the big WPI logo to earn goatbucks. Users can login with a username in order to store their name and their associated game information into the database. A leaderboard feature is also included, where you can view all players and their current amount of goatbucks.<br>

To play, simply click the WPI logo in the center of the screen. You will obtain goatbucks for each click. These goatbucks can be spent on either production upgrades or click upgrades. Production upgrades are people you can hire from various WPI buildings that will increase the amount of Goatbucks you get per second. Click upgrades are WPI-themed upgrades that increase the amount of goatbucks you get per click. Each upgrade gets exponentially more expensive the more you purchase. Logging in with a username will allow your information to be saved to the database automatically. The game will automatically save every 60 seconds. In addition, your information will save when the tab is closed. You can view your amount of goatbucks in the leaderboard section on the left side of the page.

## Project Video

https://github.com/argrabowski/wpi-clicker/assets/64287065/3d48990c-fa07-4f9f-b641-b0e72c2519ca

## What technologies did we use?

We used a combination of Vue.js, Node.js, Web Sockets, and MongoDB to build our project. Vue.js was used to create the majority of the frontend, including game logic and displaying information. Node.js was used with express to create a simple web server to host the application. Web Sockets were used to create endpoints to handle interactions with the frontend and the backend, including sending data such as scores and login information. MongoDB was used to store player information such as amount of goatbucks, amount of goatbucks per second, number of upgrades, and username into a database for persistent storage of data.

## Challenges

We had quite a few problems when developing our project. The main problem was trying to use Web Sockets. Socketio proved to be difficult to implement, as there were a few connection errors that made it difficult to conenct our frontend to our backend. Further, utlizing it properly to allow for a live user leaderboard was a completely new challenge for all members. CORS proved itself to be a diffcult problem to crack, so there are approximately 4 different fixes for it in our backend. Vue.js was not too difficult to implement, but it was new to some of our members, so we had a small learning curve to get over. Heroku also had a learning curve, especially when combined with CORS errors.

## Group Work Distribution

<ins>Frontend Development</ins><br>
Liam Rathke, Adam Grabowski, Ben Gelinas

<ins>Backend Development</ins><br>
Nicholas Markou, Kiara Munz, Liam Rathke

<ins>README Report</ins><br>
Written by Ben Gelinas<br>
Edited by Kiara Munz

<ins>Page Styling</ins><br>
Adam Grabowski

<ins>Image Editing</ins><br>
Ben Gelinas
