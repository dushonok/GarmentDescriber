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

function incr(dict, key, first) {
  var r = getDefault(dict, key, first);
  dict[key] = r + 1;
  return r;
}

function prefixZeroes(length, x) {
  var my_string = '' + x;
  for (var to_add = length - my_string.length; to_add > 0; to_add -= 1) {
    my_string = '0' + my_string;
  }
  return my_string;
}

function session(sessionId) {
  return getDefault(topDict("sessions"), sessionId, {});
}
function garments(sessionId) {
  return getDefault(session(sessionId), "garments", []);
}
function garment(sessionId, garmentId) {
  return getDefault(garments(sessionId), garmentId, []);
}


// public

function newSession(username) {
  var n = incr(topDict("sessionNumber"), username, 1);
  savePermacookie();
  
  return username + prefixZeroes(3, n);
}

function newGarment(sessionId) {
  return incr(session(sessionId), "nextGarmentId", 0);
}


// edit the field if it exists, or add it to the end of the row otherwise
function saveField(sessionId, garmentId, key, value) {
  var pairs = garment(sessionId, garmentId);
  for (var i=0; i<pairs.length; ++i) {
    var pair = pairs[i];
    if (pair[0] == key) {
      pair[1] = value;
      return;
    }
  }
  
  // add it to the end
  pairs[pairs.length] = [key, value];
}


function listSessions() {
  return Object.keys(topDict("sessions"));
}

function listGarments(sessionId) {
  var r = [];
  var n = garments(sessionId).length;
  for (var i=0; i<n; ++i) {
    r[i] = i;
  }
  return r;
}

function getField(sessionId, garmentId, key) {
  var pairs = garment(sessionId, garmentId);
  for (var i=0; i<pairs.length; ++i) {
    var pair = pairs[i];
    if (pair[0] == key) {
      return pair[1];
    }
  }
}


// one line per garment, in the order they were created,
// each of which list all the field values (separated by commas)
// in the order they were added.
function exportCSV(sessionId) {
  var r = [];
  var xss = garments(sessionId);
  for (var i=0; i<xss.length; ++i) {
    var xs = xss[i]
    for (var j=0; j<xs.length; ++j) {
      if (j != 0) r += ",";
      
      var pair = xs[j];
      r += pair[1];
    }
    r += "\n";
  }
  return r;
}

// prompt the user to download a file named "Nadya003.csv"
function downloadCSV(sessionId) {
}
