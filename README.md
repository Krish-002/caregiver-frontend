# MedMate

A new app built for PennApps and for our community of care.

Welcome to MedMate! This project is built with love for the at home caretakers of our society.

## What it does

We have centralized the logistics of at-home care, with patient safety and caretaker mindfulness as our core.

Our app is a one stop shop for all logistics in home care, compiling FDA data with prescription inputs into the page, and setting reminders and taking care of vital sign data collection. Our app has several amazing features:

1. Simply take a photo of your prescription bottle label, and the app does the rest! It will find FDA drug interaction warnings, set up a to-do list with times of when to administer medications, and keep the dosage instructions, and send notifications when it's time to administer medication. No more worrying about setting a timer and checking drug interactions over and over!
2. Enter our data entry tab, where you can take vital signs of your loved one, including weight, temperature, heart rate, and blood pressure. We will graph it for you, and determine whether the signs are in a safe range. We'll warn you if you need to seek medical help.
3. No more worrying about refills! Simply scan your prescription, and our app will ensure you won't run out of doses by reminding you when to get a refill of a prescription, keeping your mind at ease.
4. Security-minded: All data is anonymized when looking to AI for warnings, insights, and more. We have Propelauth authentication securing your account.

## How we built it

Frontend - React to build the website/mobile app, and pull in information from the backend. It was used to build the calendar, the 911 calling button, and other interfaces to present to the user.

Backend - Flask for all backend calculations and API calls with Python. Python was used to build the pytesseract image capture system for the prescription labels, then in the same backend, called TuneStudio and GPT-4o to decode the text, and present the final json in a usable manner. We also used the openFDA API to get medication warnings, and then used python to build the final json to be used by frontend. Flask was used for all the request handling and the data pipelines for the visualizations


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
