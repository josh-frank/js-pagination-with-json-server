let apiUrl = "http://localhost:3000/us-counties"
let currentUrl = "http://localhost:3000/us-counties?_limit=20&_page=1"
const tableOfCounties = document.getElementById( "counties" );

function parseLinkHeader( linkHeader ) {
    return Object.fromEntries( linkHeader.split( ", " ).map( header => header.split( "; " ) ).map( header => [ header[1].replace( /"/g, "" ).replace( "rel=", "" ), header[0].slice( 1, -1 ) ] ) );
}

function parseRoute( url ) {
    return Object.fromEntries( url.replace( `${ apiUrl }?`, "" ).split( "&" ).map( attribute => [ attribute.split( "=" )[ 0 ].slice( 1 ), attribute.split( "=" )[ 1 ] ] ) );
}

function pageNumber( url ) { return !parseRoute( url ).page ? 1 : parseRoute( url ).page }

function fetchCounties( url ) {
    tableOfCounties.innerHTML = `<tr id="header"><th>Name</th><th>Population</th></tr>`;
    fetch( url )
        .then( response => response.json().then( data => [ data, response.headers.get( "Link" ) ] ) )
        .then( countyData => {
            countyData[ 0 ].forEach( county => renderCounty( county ) );
            if ( !countyData[ 1 ] ) { document.getElementById( "page-number" ).innerHTML = "Page 1 of 1"; }
            else {
                document.getElementById( "page-number" ).innerHTML = `Page ${ pageNumber( currentUrl ) } of ${ pageNumber( parseLinkHeader( countyData[ 1 ] ).last ) }`;
            }
        } );
}

function renderCounty( county ) {
    let countyRow = document.createElement( "tr" );
    countyRow.classList.add( "county-row" );
    let countyName = document.createElement( "td" );
    countyName.classList.add( "county-cell" );
    countyName.innerHTML = `${ county.type } of ${ county.name }, ${ county.state }`
    let countyPopulation = document.createElement( "td" );
    countyPopulation.classList.add( "county-cell" );
    countyPopulation.innerHTML = Number( county.population ).toLocaleString();
    countyRow.append( countyName, countyPopulation );
    tableOfCounties.append( countyRow );
}

function paginate( direction ) {
    fetch( currentUrl ).then( response => {
        let linkHeaders = response.headers.get( "Link" );
        if ( linkHeaders ) {
            let headersObject = parseLinkHeader( response.headers.get( "Link" ) );
            if ( !!headersObject[ direction ] ) {
                currentUrl = headersObject[ direction ];
                fetchCounties( headersObject[ direction ] );
            }
        }
    } );
}

function searchCounties( searchFormSubmission ) {
    searchFormSubmission.preventDefault();
    currentUrl = `http://localhost:3000/us-counties?${ searchFormSubmission.target.elements.filter.value }=${ searchFormSubmission.target.elements.query.value }&_limit=${ searchFormSubmission.target.elements.limit.value }&_page=1`;
    fetchCounties( currentUrl );
}

document.addEventListener( "DOMContentLoaded", () => {
    fetchCounties( currentUrl );
    document.getElementById( 'search' ).addEventListener( 'submit', searchCounties );
    document.getElementById( 'first' ).addEventListener( 'click', () => { paginate( "first" ) } );
    document.getElementById( 'back' ).addEventListener( 'click', () => { paginate( "prev" ) } );
    document.getElementById( 'forward' ).addEventListener( 'click', () => { paginate( "next" ) } );
    document.getElementById( 'last' ).addEventListener( 'click', () => { paginate( "last" ) } );
} );
