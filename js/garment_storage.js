// private

function getDefault(dict, key, default_value) {
  console.assert(typeof dict === "object");
  console.assert((typeof key === "string") || (typeof key === "number"));
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
function clearPermacookie() {
  permacookie = undefined;
  window.localStorage.clear();
}
function savePermacookie() {
  window.localStorage[permacookie_key] = JSON.stringify(permacookie);
  
  // make sure the data is recoverable
  permacookie = undefined;
  permacookie = getPermacookie();
}

function topDict(key) {
  console.assert(typeof key === "string");
  return getDefault(getPermacookie(), key, {});
}

function incr(dict, key, first) {
  console.assert(typeof dict === "object");
  console.assert(typeof key === "string");
  console.assert(typeof first === "number");
  var r = getDefault(dict, key, first);
  dict[key] = r + 1;
  return r;
}

// http://jsperf.com/ways-to-0-pad-a-number/5
function prefixZeroes(length, x) {
  console.assert(typeof length === "number");
  console.assert(typeof x === "number");
  var my_string = '' + x;
  for (var to_add = length - my_string.length; to_add > 0; to_add -= 1) {
    my_string = '0' + my_string;
  }
  return my_string;
}

// http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
function download(filename, text) {
  var pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  pom.setAttribute('download', filename);
  pom.click();
}

function session(sessionId) {
  console.assert(typeof sessionId === "string");
  return getDefault(topDict("sessions"), sessionId, {});
}
function garments(sessionId) {
  console.assert(typeof sessionId === "string");
  return getDefault(session(sessionId), "garments", []);
}
function garment(sessionId, garmentId) {
  console.assert(typeof sessionId === "string");
  return getDefault(garments(sessionId), garmentId, []);
}


// public

function getDefaultUsername() {
  return "defaultUser";
}

function newSession(username, oauth_code) {
  console.assert(typeof username === "string");
  var n = incr(topDict("sessionNumber"), username, 1);
  var sessionId = username + prefixZeroes(3, n);
  session(sessionId)["oauth_code"] = oauth_code;
  savePermacookie();
  
  return sessionId;
}

function getDefaultSessionId() {
  return "defaultUser001";
}

function getOAuthCode(sessionId) {
  return session(sessionId)["oauth_code"];
}

function newGarment(sessionId) {
  console.assert(typeof sessionId === "string");
  return incr(session(sessionId), "nextGarmentId", 0);
}


// edit the field if it exists, or add it to the end of the row otherwise
function saveField(sessionId, garmentId, key, value) {
  if (value === undefined) return;
  console.assert(typeof sessionId === "string");
  console.assert(typeof garmentId === "number");
  console.assert(typeof key === "string");
  if (key === "ItemMatrix") {
    console.assert(typeof value === "object");
    console.assert(typeof value[0] === "string");
  } else {
    console.assert(typeof value === "string");
  }
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
  savePermacookie();
}


function listSessions() {
  return Object.keys(topDict("sessions"));
}

function listGarments(sessionId) {
  console.assert(typeof sessionId === "string");
  var r = [];
  var n = garments(sessionId).length;
  for (var i=0; i<n; ++i) {
    r[i] = i;
  }
  return r;
}

function getField(sessionId, garmentId, key) {
  console.assert(typeof sessionId === "string");
  console.assert(typeof garmentId === "number");
  console.assert(typeof key === "string");
  var pairs = garment(sessionId, garmentId);
  for (var i=0; i<pairs.length; ++i) {
    var pair = pairs[i];
    if (pair[0] == key) {
      return pair[1];
    }
  }
}


// an array of dictionaries from keys to values.
function exportJson(sessionId) {
  console.assert(typeof sessionId === "string");
  var r = [];
  var xss = garments(sessionId);
  for (var i=0; i<xss.length; ++i) {
    var xs = xss[i]
    var g = {};
    if (xs === null) {
      window.localStorage.clear();
      alert("A mysterious error has occurred. Please refresh and try again.");
      return r;
    } else {
      for (var j=0; j<xs.length; ++j) {
        var pair = xs[j];
        var key = pair[0];
        var value = pair[1];
        if (value != "") {
          g[key] = value;
        }
      }
    }
    r[i] = g;
  }
  return r;
}

// one line per garment, in the order they were created,
// each of which list all the field values (separated by commas)
// in the order they were added.
function exportCSV(sessionId) {
  console.assert(typeof sessionId === "string");
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
  console.assert(typeof sessionId === "string");
  download(sessionId + ".csv", exportCSV(sessionId));
}


function listFieldKeys() {
  return ["Category", "TaxClass", /*"ItemMatrix",*/ "Manufacturer", "Vendor", "Consignors"];
}

function listFieldValues(fieldKey, callback) {
  console.assert(typeof fieldKey === "string");
  console.assert(typeof callback === "function");
  var code = getOAuthCode(getDefaultSessionId());
  var url = "http://gelisam.com/ff/GarmentDescriber/list-field-values.php?code=" + code + "&key=" + fieldKey;
  $.getJSON(url, callback);
}

function uploadGarment(sessionId, garmentId, callback) {
  console.assert(typeof sessionId === "string");
  console.assert(typeof garmentId === "number");
  console.assert(typeof callback === "function");
  var code = getOAuthCode(sessionId);
  var url = "http://gelisam.com/ff/GarmentDescriber/upload-item.php?code=" + code;
  $.ajax({
    type: "POST",
    dataType: "json",
    url: url,
    data: exportJson(sessionId)[garmentId],
    success: callback
  });
}
