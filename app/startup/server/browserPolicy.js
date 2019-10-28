import { BrowserPolicy } from 'meteor/browser-policy-common';

// Bootstrap
BrowserPolicy.content.allowOriginForAll('*.bootstrapcdn.com');

// FontAwesome
BrowserPolicy.content.allowOriginForAll('use.fontawesome.com');

// GraphQL Playground
BrowserPolicy.content.allowOriginForAll('graphcool-playground.netlify.com');
BrowserPolicy.content.allowOriginForAll('cdn.jsdelivr.net');

// Replace these with your own content URLs
BrowserPolicy.content.allowOriginForAll('cleverbeagle-assets.s3.amazonaws.com');
BrowserPolicy.content.allowOriginForAll('s3-us-west-2.amazonaws.com');
BrowserPolicy.content.allowFontOrigin('data:');

// Temp for temporary logo
BrowserPolicy.content.allowOriginForAll('www.graphicsprings.com');

//Temp to debug issue running with remote DB, Events collection not loading
// [Warning] [blocked] The page at https://counterthreat.app/events was not allowed to display insecure content from http://localhost:3000/graphql. (47709921385259f142456d761057c4259688d4a7.js, line 9)

BrowserPolicy.content.allowOriginForAll('localhost:3000/graphql');

