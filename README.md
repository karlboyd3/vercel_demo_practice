# Global Health Dashboard

A one-page dashboard with two charts, built for a Vercel deployment demo.
It is plain HTML, CSS and JavaScript. There is no build step and no server code.

## What is in this repo

```
index.html                  the page
style.css                   colors, fonts, layout
app.js                      reads the CSV and draws the two charts
data/life-expectancy.csv    the dataset (Gapminder, 5 countries, 1955 to 2005)
vendor/chart.umd.min.js     Chart.js 4.6.1, saved here so the page never depends on another website
```

## Run it on your own computer

Browsers block a page from reading local files directly, so start a tiny local server:

```
python -m http.server 8000
```

Then open http://localhost:8000 in your browser. Press Ctrl+C in the terminal to stop it.

## Data

Gapminder country data (life expectancy and babies per woman), via the vega-datasets package.
Rows: 55 (5 countries x 11 years).
