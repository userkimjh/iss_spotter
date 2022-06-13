const request = require('request');
const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    }
    
    return callback(null, JSON.parse(body).ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`https://api.ipbase.com/v2/info/?ip=${ip}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP Coord. Response: ${body}`;
      return callback(Error(msg), null);
    }
    const { latitude, longitude } = JSON.parse(body).data.location;

    return callback(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching fly over time. Response: ${body}`;
      return callback(Error(msg), null);
    }
    const data = JSON.parse(body).response;
    return callback(null, data);
  });
};


const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work!" , error);
      return;
    }
    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        console.log("It didn't work!" , error);
        return;
      }
      fetchISSFlyOverTimes(coordinates, (error, response) => {
        if (error) {
          console.log("It didn't work!" , error);
          return;
        }
        callback(null, response);
      });
    });
  });
};


module.exports = { nextISSTimesForMyLocation };