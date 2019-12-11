# Muddy-Messenger-2
CSE 4471 End-to-End encryption messaging app

## How to run:
First clone the repo.

Make sure you have node and npm installed. Go to https://nodejs.org/en/ and install the correct version of node then https://www.npmjs.com/get-npm to get npm. Make sure 'node -v' and 'npm -v' work before moving to the next step.

Make sure you have angular installed. https://angular.io/guide/setup-local has the intructions on how to get angular set up on your local machine

Next you need to have python 3 installed. Go to https://www.python.org/downloads/ and install the latest version compatible with your machine. 

Lastly you need SQLite database. Go to https://www.sqlite.org/download.html and download and install the correct version for your machine.

### First time running:
Go into the frontend directory and run 'npm install' to install all dependencies used to run the front end
Next go into the backend directory and run 'pip install -r requirements.txt' to install all the packages used in the back end

### Running the application:
In one terminal go to the frontend directory and run 'ng serve' and you should get the message that it is hosted on localhost:4200

In a separate terminal go to the backend directory and run 'python3 main.py' or 'py main.py' to run the backend

After both of these are hosted you should be able to go to localhost:4200 in a web browser and start Muddying Messages!!
