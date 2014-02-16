// private

var permacookie = undefined;
var permacookie_key = "garment_storage";
function getPermacookie() {
  if (permacookie === undefined) {
    if (window.localStorage[permacookie_key] === undefined) {
      window.localStorage[permacookie_key] = JSON.stringify({});
    }
    permacookie = JSON.parse(window.localStorage[permacookie_key]);
  }
  return permacookie;
}
function savePermacookie() {
  window.localStorage[permacookie_key] = JSON.stringify(permacookie);
  
  // make sure the data is recoverable
  permacookie = undefined;
  permacookie = getPermacookie();
}

function saveSessionNumber(n) {
  getPermacookie()["lastSessionNumber"] = n;
  savePermacookie();
}
function lastSessionNumber() {
  if (getPermacookie()["lastSessionNumber"] === undefined) {
    saveSessionNumber(0);
  }
  return getPermacookie()["lastSessionNumber"];
}

function prefixZeroes(length, x) {
  var my_string = '' + x;
  for (var to_add = length - my_string.length; to_add > 0; to_add -= 1) {
    my_string = '0' + my_string;
  }
  return my_string;
}


// public

function newSession(username) {
  var n = lastSessionNumber() + 1;
  saveSessionNumber(n);
  
  return "Nadya" + prefixZeroes(3, n);
}

function newGarment(sessionId) {
  return 0;
}


// edit the field if it exists, or add it to the end of the row otherwise
function saveField(sessionId, garmentId, key, value) {
}


function listSessions() {
  return ["Nadya001"];
}

function listGarments(sessionId) {
  return [0, 1];
}

function getField(sessionId, garmentId, key) {
  return "Betty Liu";
}


// prompt the user to download a file named "Nadya003.csv"
// with one line per garment, in the order they were created,
// each of which list all the field values (separated by commas)
// in the order they were added.
function exportCSV(sessionId) {
  return "Betty Liu,dress,blue,100.0\nNadya Dushonok,bracelet,rainbow,15.0\n";
}
