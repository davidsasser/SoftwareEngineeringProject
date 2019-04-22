# Final Project - Group C 

This is the final project for CSC 7135. It is a Node/Express project with a Postgres database.

## Contributers
* David Sasser
* Samira Soleimani
* Karameh Mohammadiporshokooh
* Baozhong Wang

## Getting Started

### Prerequisites

You will need to install Node.js and PostgreSQL to run this project.

* [Node.js](https://nodejs.org/en/)
* [PostgreSQL](https://www.postgresql.org/download/)
    * Create the root postgres user with the password postgres

### Installing

Once both are installed and the project is cloned you will need to:

1. Create a database called Group_C.
2. Update Line 6 to use your local PostgreSQL installation:
```
export PATH=[YOUR LOCAL PATH]:$PATH
```
3. Import the database tables by running:
```
cd enviornment
importDatabase.sh
```
4. Install node modules by running:
```
cd ..
npm install
```

### Running the Project

To run the project make sure you are in the root directory of the project and run:
```
npm start
```

## Authors

* **David Sasser**
* **Samira Soleimani**
* **Karameh Mohammadiporshokooh**
* **Baozhong Wang**
