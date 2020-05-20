# Employee Tracker 

## A command-line application for managing a company's employees built using node, inquirer prompts, and MySQL.

Current functionality: 
* add departments, roles and employees
* view departments, roles and employees 
* update employee roles

## Installation 

To run and develop the code for yourself, you can use an IDE such as [VS Code](https://code.visualstudio.com/). 

In order to use this application as intended, you must have Node.js installed. You can download it [here](https://nodejs.org/en/download/). Step-by-step installation instructions can be found [here](https://phoenixnap.com/kb/install-node-js-npm-on-windows). 

You must also install Inquirer (for prompting the user) and mysql (for interacting with the database), which you can do by calling `npm init` and `npm install` from the command line. For more detailed information, check out the documentation for [Inquirer](https://www.npmjs.com/package/inquirer) and [mysql](https://www.npmjs.com/package/mysql). 

To get the database up and running, you can use the schema and the seeds provided. I used [MySQL](https://dev.mysql.com/downloads/mysql/) with [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) as an editor. 

## Usage  

To begin the application, run `node index.js` from the command line. Then, fill in the information as prompted. The database will be updated accordingly.