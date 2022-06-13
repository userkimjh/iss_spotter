const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(ipJSON) {
  const ip = JSON.parse(ipJSON).ip;
  return request(`https://api.ipbase.com/v2/info/?ip=${ip}`);
};

const fetchISSFlyOverTimes = function(body) {
  const {latitude, longitude} = JSON.parse(body).data.location;
  return request(`https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`);
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then(body => {
      const data = JSON.parse(body).response;
      return data;
    });
};


module.exports = { nextISSTimesForMyLocation };