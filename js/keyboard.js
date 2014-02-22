function registerShortcuts(shortcuts) {
  var mod_mapping = {
    16: "SHIFT",
    17: "CTRL",
    18: "ALT",
    91: "CTRL",
    93: "CTRL"
  };
  var key_mapping = {
    13: "ENTER",
    27: "ESC",
    32: "SPACE",
    37: "LEFT",
    38: "UP",
    39: "RIGHT",
    40: "DOWN",
    65: "A",
    66: "B",
    67: "C",
    68: "D",
    69: "E",
    70: "F",
    71: "G",
    72: "H",
    73: "I",
    74: "J",
    75: "K",
    76: "L",
    77: "M",
    78: "N",
    79: "O",
    80: "P",
    81: "Q",
    82: "R",
    83: "S",
    84: "T",
    85: "U",
    86: "V",
    87: "W",
    88: "X",
    89: "Y",
    90: "Z",
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9"
  };
  var still_valid_in_input_field = [
    "ENTER",
    "ESC",
    "UP",
    "DOWN"
  ];
  var ctrl_active  = false;
  var shift_active = false;
  var alt_active   = false;
  $(document).keydown(function(e) {
    if (mod_mapping[e.which] == "CTRL")  ctrl_active  = true;
    if (mod_mapping[e.which] == "SHIFT") shift_active = true;
    if (mod_mapping[e.which] == "ALT")   alt_active   = true;
  });
  $(document).keyup(function(e) {
    if (mod_mapping[e.which] == "CTRL")  ctrl_active  = false;
    if (mod_mapping[e.which] == "SHIFT") shift_active = false;
    if (mod_mapping[e.which] == "ALT")   alt_active   = false;
    if (key_mapping[e.which]) {
      if (
        $(document.activeElement).prop("tagName") == "INPUT" &&
        !ctrl_active &&
        !alt_active &&
        !still_valid_in_input_field[e.which]
      ) {
        // skip keypresses performed while typing in an input field
        return;
      }
      
      var key_combination = "";
      if (ctrl_active)  key_combination += "CTRL+";
      if (shift_active) key_combination += "SHIFT+";
      if (alt_active)   key_combination += "ALT+";
      key_combination += key_mapping[e.which];
      if (shortcuts[key_combination]) {
        shortcuts[key_combination]();
      } else {
        //console.log(key_combination + " was pressed (debug)");
      }
    }
  });
}
