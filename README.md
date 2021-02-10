# Pagination in json-server

This code is an accompaniment to a [this blog post](https://joshgoestoflatiron.medium.com/february-10-pagination-in-a-json-server-api-with-the-link-header-dea63eb0a835), which demonstrates pagination routes in `json-server` and how to access and parse the link header to make use of them when building a web application. It comes with:
- a mock server, `db.json`, with population data for the 3,142 counties of the 50 US States as of the last census
- a JavaScript file, `index.js`, which handles requests to the database
- a web page, `index.html`, which displays the database along with a search bar and pagination buttons

In the terminal, enter `npm install -g json-server` and then `json-server db.json`. Listen on port 3000 to run the app with the command `open index.html`.