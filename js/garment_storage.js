function newSession(username) {
  return "Nadya001";
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
