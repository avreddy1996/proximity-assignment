# Proximity Assignment

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn deploy`
Deploys the application using gh-pages module

Currently this Project is deployed
[here using gh-pages](https://avreddy1996.github.io/proximity-assignment/) \
https://avreddy1996.github.io/proximity-assignment/

# Problem Statemet
Deploy A SPA to display live air quality index monitoring data.

# Approach
I am using React Application here bootstrapped by create-react-app scaffolding code.\
All the logic related to application resides in Dashboard.js component file.\
I am listing all the cities along with updated AQI index to corresponding city name in a tabular format for easy viewing along with categroy color as background.\
Each City row has an actionable to track its index and visualise in graphical format.

# Third party modules used
Victory Charts - for visualising live tracking data of AQI and also for comparing different cities AQI data.\
Material UI - for table and button components
