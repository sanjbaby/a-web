# Test Automation and Monitoring - Web

tam-web is the web part of tam. It is a single react application which communicates with the tam-api.

## Basic concepts

tam-web is an application built in [React](https://reactjs.org/), using react hooks instead of higher order components.
Other prominent features used:
* [Redux](https://redux.js.org/) as state container
* [Material UI](https://material-ui.com/) as UI library
* [React router](https://reacttraining.com/react-router/) for routing within the app
* [React Hook Form](https://react-hook-form.com/) as form builder

## Code style

[Prettier](https://prettier.io/) is used as an opinionated code formatter. The only option change is line 
width set to 100 instead of 80. The reason for this is that it works good with Jetbrains IDEs.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!
