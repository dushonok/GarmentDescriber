// private

function getDefault(dict, key, default_value) {
  if (dict[key] === undefined) {
    dict[key] = default_value;
  }
  return dict[key];
}

var permacookie = undefined;
var permacookie_key = "garment_storage";
function getPermacookie() {
  if (permacookie === undefined) {
    permacookie = JSON.parse(
      getDefault(window.localStorage, permacookie_key, JSON.stringify({}))
    );
  }
  return permacookie;
}
function savePermacookie() {
  window.localStorage[permacookie_key] = JSON.stringify(permacookie);
  
  // make sure the data is recoverable
  permacookie = undefined;
  permacookie = getPermacookie();
}

function topDict(key) {
  return getDefault(getPermacookie(), key, {});
}

function saveSessionNumber(username, n) {
  topDict("lastSessionNumbers")[username] = n;
  savePermacookie();
}
function lastSessionNumber(username) {
  return getDefault(topDict("lastSessionNumbers"), username, 0);
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
  var n = lastSessionNumber(username) + 1;
  saveSessionNumber(username, n);
  
  return username + prefixZeroes(3, n);
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
