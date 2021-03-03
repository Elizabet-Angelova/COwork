# CoWork Documentation


## I. Purpose
### CoWork is a Covid-19 safe workspace portal meant to help companies bring their employees back in the office in a safe and easy manner.



## II. Features
### CoWork uses an external API in order to get the latest real time Covid-19 info such as :
- Number of cases per country
- Number of new cases per day
- Number of tests made per day
### CoWork has a user panel and an admin panel.

#### Users can register and enjoy a variety of features which will be available once they log in :
- Have a bird's eye view of the office in which they work and the positioning of all employees
- See where they are scheduled to work from next week (home or office)
- See the entire team of the project they are working on
- Request a vacation leave
- See today's Covid-19 data for the country they are working from
- Log in with either e-mail or username

#### The Admin panel is only accessible if you are logging in from an admin account. It offers features such as :
- Add the country/countries from which your company is working
- Create a virtual office for each country and position the desks from which employees will work
- Create and delete projects
- Assign employees to projects
- Manage employee roles
- Approve/decline user vacations
- Delete users
- Have access to real time Covid-19 data for each country your company is working in
- Have access to real time Covid-19 data on demand
- Decide how many of the users can go back to the office (edit percentages)

### Additional features :
- Automatically assign employees working on the same project in the office
- Automatically assign safe workplaces for all employees in the office
- Automatically gather Covid-19 data every day
- Real time form validation

<br>

### III. Installation
#### CoWork has two sepparate folders which we need to look at in order to install the required dependencies. Front-end and back-end.
#### You will need to run ```npm install``` in both folders in order to run the project, then you are all set to go!
<br>

### IV. Running the project
#### Go in the back-end folder, open git bash (or any command prompt you are using), run ```npm run start:dev``` - this will get the DB up and running on port 3000, as well as all the NestJS functionalities in dev mode.
#### Go to the front-end folder, open git bash and run ```npm start``` - this will automatically run the UI on port 4000. You are all set!
<br>

### V. Components
#### CoWork uses NestJS for its back-end and React for its front end parts, sepperated in different folders with different dependencies. If you want to run the DB, you won't need React's dependencies.
#### There are multiple services, controllers and DTOs that are responsible for the application's back end part.
#### The front end UI is entirely custom made and responsive, sepperated in different modules and folders.