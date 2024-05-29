# Bracketbot - Tournament management made easy.

## 📋 What is it?

Bracketbot is a web application that allows tournament managers to generate matchups, schedules, and brackets from start to finish with a few simple clicks.  Gone are the days of spreadsheets and manual calculation for team rankings.

## ✍️ How do I use it?
Managers can add teams & assign them to pools.  

![example of drag-n-drop pools](https://i.imgur.com/gpOL9wZ.png)

From there, Bracketbot will generate a full pool play schedule based on the number of fields available.  There are options for game length, break length, and crossover games as well.

![example of pool play schedule](https://i.imgur.com/d1HtJlm.png)

Once the manager inputs all the scores for pool play, the Bracketbot algorithm will rank teams and generate a classic bracket schedule to determine the winner of the tournament.  This schedule is also based off of game length and available fields.  Upcoming bracket games are automatically assigned as team scores are recorded.

![example of bracket schedule](https://i.imgur.com/wF762Bq.png)


## 🚀 Challenges Encountered

### Drag-n-Drop Pool Assignment
I originally intended for the user to tell the algorithm how many games it wanted and let the algorithm figure out how to create pools.  This turned out to be much harder than I expected and I opted to let the user assign pools themselves with a simple, easy to use component. This was my first time building a drag-n-drop component and react-beautiful-dnd made it so simple.

### Bracket as a Binary Tree
To build the bracket, I used a binary tree built from the branches back to the roots.  Each Game instance in the bracket holds the foreign key of the next game with a backref to previous_games which can have a length of 0-2.

### Scheduling Algorithms
Creating matchups between teams and assigning games to fields without overlap took a lot more thinking and iterating than I expected. It was a fun challenge to optimize for time-efficiency.

### Scaling Back
I originally intended for team captains to be able to log in and submit their own scores as the tournament goes on.  However, with about a month and a half allotted to this project, I scaled back to give full control to the tournament manager.  The database is still optimized to a hold scores submitted by team captains, so hopefully I can revisit this project to add that.

## 💻 Running the app locally

### Server
```console
source ~/.bash_profile
pipenv install
pipenv shell
cd server
flask db init
flask db upgrade
python app.py
```

### Client
```console
npm install --prefix client
cd client
npm start
```

## 🗂️ Stack
- ReactJS & Semantic UI for front end
- Flask & SQL-Alchemy for back end


## 📈 Future Plans
I have lots of ideas for this project.  Like, a lot.
1. Add team pages so a team can see only its own schedule
2. Add a ranking component that updates in real time so teams know where they stand
3. Add a private link for team captains to submit their scores for each game.  If 2 teams have a dispute over the score, they can choose to take the average or defer to the tournament manager.
4. Make everything PRETTIER.
5. Allow a tournament manager to rearrange games to different fields via drag-n-drop so teams don't have to move as much.

## All Rights Reserved

This project is the intellectual property of Elise Erickson and is protected by copyright law. 
Unauthorized use, reproduction, or distribution of this software, in whole or in part, 
is strictly prohibited without the express written consent of the copyright holder.

