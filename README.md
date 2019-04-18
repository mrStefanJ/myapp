# My App

## Getting started

### Prerequisites

Please first unzipp 'database&more' and import database into your phpmyadmin. Inside unzipped folder you'll
find folder api. This folder contains all REST API's built in php. Place this folder inside 
```
    htdocs
```
folder in MAMP, XAMP or something else you're using. Please, if you have any issues with the API calls, you probably need to change the port foreach API call. Currently all calls have port 8888. Run Apache servers and then you can continue with this project instalation

### Installation

run `npm install`

### Local development

For local development we use storybook to show all available components.  
To start the component overview run `npm start`

## Folder Structure

The overall structure is divided into the following sections:

- `layouts` for layouts that are used for populating certain fields
- `scripts` contains main js file for whole project
- `styles` sontains main styling for whole project

```
├── layouts
├── scripts
└── styles
```