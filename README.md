# Weather Taipei
This is a website to display Taipei weather that is built with React.js.

Demo site: 

## Getting Started
In order to create a fake API easily, I create this project by [Next.js](https://nextjs.org/docs/getting-started) and put some fake API under `pages/api/*`.
All json responses are copied from real Central Weather Bureau APIs.

Install and run: 
```
npm install
npm run dev
```

## Features
1. Responsive on mobile, tablet and desktop. 

2. Night weather images are displayed when sunset starts.

## Components

### Dashboard
The data will be reloaded by clicking the refresh button.

![dashboard](https://user-images.githubusercontent.com/87522693/156311234-17ac3e7b-b403-4682-8e24-c1488513cae2.png)

- Mobile view

![mobile_view](https://user-images.githubusercontent.com/87522693/156311348-f3dd2419-8707-4d30-9d75-88702bb354a4.png)

- Night weather icon

![night](https://user-images.githubusercontent.com/87522693/156311532-0eecd319-a3e1-4743-8927-0cb4ae2072cc.png)

### Current Weather
Display location(臺北), weather description, wind speed and humidity from API `pages/api/observation.js`.

### Weather Icon
- Display current weather from API `pages/api/weatherType.js`
- Get sunset data from API `pages/api/sunriseSunset.js` to shift night weather icons. The current date time is hardcoded to 2022/02/12 08:30 am for demonstration purpose.

### Weekly Forecast
- Display 7-day weather forecasts from API `pages/api/weeklyFroecast.js`.
- On mobile view, it can be scrolled  horizontally to check the forecasts.



