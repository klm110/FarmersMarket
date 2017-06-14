// Initialize Firebase
var config = {
  apiKey: "AIzaSyB_56Il0271ry-cycR66ma3mOcLoMLX8M4",
  authDomain: "farmersmarket-c927a.firebaseapp.com",
  databaseURL: "https://farmersmarket-c927a.firebaseio.com",
  projectId: "farmersmarket-c927a",
  storageBucket: "farmersmarket-c927a.appspot.com",
  messagingSenderId: "765507152646"
};
firebase.initializeApp(config);
var database = firebase.database();

var markets = [];

function farmersMarket() {
  this.id = null;
  this.name = null;
  this.address = null;
  this.googleLink = null;
  this.products = null;
  this.schedule = null;
}

// Search function
$(function() {
  $("#button-search").on("click", function() {
    var zipcode = $("#zip-code").val().trim();
    getMarkets(zipcode);
  });

});


function getMarkets(zip) {
  $.ajax({
    type: "GET",
    contentType: "application/json; charset=utf-8",
    // submit a get request to the restful service mktDetail.
    // url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + id,
    url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zip,
    dataType: 'jsonp',
    jsonpCallback: 'marketResultHandler'
  });
}

//iterate through the JSON result object.
function marketResultHandler(detailresults) {
  var marketList = detailresults.results;
  for (var key in marketList) {
    var newMarket = new farmersMarket();
    newMarket.id = marketList[key].id;
    newMarket.name = marketList[key].marketname;
    markets.push(newMarket);
  }

  $.each(markets, function(index, value) {
    getDetails(markets[index], index);
  });
}

function getDetails(market, index) {
  var id = market.id;
  var name = market.name;

  window['detailResultHandler' + id] = function(data) {
    var currentMarket = data.marketdetails;
    var newRow = ' \
    <tr> \
      <td>' + name + '</td> \
      <td>' + '<a href="' + currentMarket["GoogleLink"] + '">' + currentMarket["Address"] + '</a></td> \
      <td>' + currentMarket["Products"] + '</td> \
      <td></td> \
      <td>' + currentMarket["Schedule"] + '</td> \
    </tr>';
    $(".table tbody").append(newRow);
  }

  $.ajax({
    type: "GET",
    contentType: "application/json; charset=utf-8",
    // submit a get request to the restful service mktDetail.
    url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + id,
    // url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zip,
    dataType: 'jsonp',
    jsonpCallback: 'detailResultHandler' + id
  });
}

function displayMarkets(detailresults) {
  var currentMarket = detailresults.marketdetails;
  var newRow = ' \
    <tr> \
      <td>' + 'NAME GOES HERE' + '</td> \
      <td>' + '<a href="' + currentMarket["GoogleLink"] + '">' + currentMarket["Address"] + '</a></td> \
      <td>' + currentMarket["Products"] + '</td> \
      <td></td> \
      <td>' + currentMarket["Schedule"] + '</td> \
    </tr>';
  console.log(newRow);
  $(".table tbody").append(newRow);
}

// Populate the table with the list farmers markets
database.ref().on("value", function(snapshot) {
    var data = snapshot.val();
    $(".table tbody").empty();
    if (data) {
      for (var key in data) {
        var thisObject = data[key];
        console.log(data[key]);

        // Add new row here
      }
    } else {
      $(".table tbody").append("No farmers markets add one.")
    }
  },
  function(errorObject) {
    console.log("The read failed: " + errorObject.code)
    $(".table tbody").append("Error getting farmers markets schedule!");
  }
);

$("#button-submit").on("click", function() {

});

function addMarket() {
  database.ref().push({
    id: market.id,
    name: market.name,
    address: market.address,
    googleLink: market.googleLink,
    products: market.products,
    schedule: market.schedule,
  });
}