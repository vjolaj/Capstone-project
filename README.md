# Splitzies
https://splitzies.onrender.com/

* Splitzies is a website inspired by Splitwise!

## Introduction

Splitzies is a website that helps users manage shared expenses within groups. Splitzies keeps track of who owes who and helps users settle up with each other by recording a history of payments. Its current functionality includes the following features:

* Signing up a new user and logging in as an existing user
* Creating, Reading, Updating and Deleting groups
* Creating, Reading, Updating and Deleting group members associated with a group
* Creating, Reading, Updating expenses (which are split equally within members of the group)
* Creating and Reading settled payments

Future functionality includes:
* Comments: users will be able to post comments associated with individual expenses
* Budget: users will be able to set budgets for any of the expense categories, and the app will keep track of whether or not the user has gone over their budget

--------------------------------------------------------------------------------------------------------------------------------------

## Technologies used:
This site uses a Flask-React stack

   ### Backend:
   * Python
   * SQLAlchemy 
   ### Frontend:
   * Javascript
   * React
   * Redux

---------------------------------------------------------------------------------------------------------------------------

## Launching locally instructions:
Running the backend server:
* From the root directory, run "pipenv install -r requirements.txt" to install dependencies
* Run "pipenv shell" to run the virtual environment
* Run "flask db upgrade" to create a local database
* Run "flask seed all" to populate the database with seed data
* Run "flask run" to boot up the backend server

Running the frontend server:
* From the root directory, cd into the react-app directory/folder
* Run "npm install" to install dependencies
* Run "npm start" to boot up the frontend server and open a browser tab to the landing page

------------------------------------------------------------------------------------------------------------------------------------

# Images: 

## Landing Page
![landing-page](https://cdn.discordapp.com/attachments/1116216556800716822/1136531346269937724/Screenshot_2023-08-02_at_10.25.32_PM.png)

## Log In Page
![splitzies-login-page](https://cdn.discordapp.com/attachments/1116216556800716822/1136531346576117830/Screenshot_2023-08-02_at_10.26.34_PM.png)

## User Dashboard Page
![user-dashboard-page](https://cdn.discordapp.com/attachments/1116216556800716822/1136531347855392789/Screenshot_2023-08-02_at_10.28.12_PM.png)

## Create a Group Page
![create-group-page](https://cdn.discordapp.com/attachments/1116216556800716822/1136531347473703012/Screenshot_2023-08-02_at_10.28.00_PM.png)

## Group Page
![past-orders-page](https://cdn.discordapp.com/attachments/1116216556800716822/1136531348237062160/Screenshot_2023-08-02_at_10.28.30_PM.png)


