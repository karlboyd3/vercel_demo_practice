// This file loads the CSV, reshapes it, and draws two charts.
// There are no API calls: the data is a file that lives in this repo.

// Big, thick, high-contrast settings so everything reads over Zoom.
Chart.defaults.font.size = 18;
Chart.defaults.font.family = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
Chart.defaults.color = '#1b1b1b';

// A color-blind-friendly palette, one color per country.
const COUNTRY_COLORS = {
  'United States': '#0072B2',
  'China': '#D55E00',
  'India': '#009E73',
  'Brazil': '#CC79A7',
  'Nigeria': '#E69F00',
};

// Turn the CSV text into a list of row objects. Numbers become real numbers.
function parseCsv(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const cells = line.split(',');
    const row = {};
    headers.forEach((h, i) => {
      row[h] = h === 'country' ? cells[i] : Number(cells[i]);
    });
    return row;
  });
}

function drawLineChart(rows) {
  const years = [...new Set(rows.map((r) => r.year))].sort((a, b) => a - b);
  const countries = [...new Set(rows.map((r) => r.country))];

  const datasets = countries.map((country) => ({
    label: country,
    data: years.map((y) => rows.find((r) => r.country === country && r.year === y).life_expectancy),
    borderColor: COUNTRY_COLORS[country],
    backgroundColor: COUNTRY_COLORS[country],
    borderWidth: 6,
    pointRadius: 5,
    tension: 0,
  }));

  new Chart(document.getElementById('lineChart'), {
    type: 'line',
    data: { labels: years, datasets },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 20 }, boxWidth: 40, boxHeight: 6 } } },
      scales: {
        y: { title: { display: true, text: 'Years', font: { size: 20 } } },
      },
    },
  });
}

function drawBarChart(rows) {
  const countries = [...new Set(rows.map((r) => r.country))];
  const valueFor = (country, year) =>
    rows.find((r) => r.country === country && r.year === year).babies_per_woman;

  // The 2005 bars use the page's accent color, so a CSS change shows up here too.
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();

  new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels: countries,
      datasets: [
        { label: '1955', data: countries.map((c) => valueFor(c, 1955)), backgroundColor: '#8b8b8b' },
        { label: '2005', data: countries.map((c) => valueFor(c, 2005)), backgroundColor: accent },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 20 }, boxWidth: 40, boxHeight: 16 } } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Babies per woman', font: { size: 20 } } },
      },
    },
  });
}

async function main() {
  try {
    const response = await fetch('data/life-expectancy.csv');
    if (!response.ok) throw new Error('Could not load data/life-expectancy.csv');
    const rows = parseCsv(await response.text());
    drawLineChart(rows);
    drawBarChart(rows);
  } catch (err) {
    const box = document.getElementById('error');
    box.textContent = 'Something went wrong: ' + err.message;
    box.hidden = false;
  }
}

main();
