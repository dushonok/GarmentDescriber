#!/bin/bash
ID="$1"
TAGS="$2"
NOTE="$3"
APIKEY="$(cat key)"
TOKEN="$(cat token)"
# --user "$APIKEY:apikey"
curl -X PUT --data "$(
  echo "<?xml version=\"1.0\"?>"
  echo "<Item>"
  if [ "$TAGS" ]; then
    echo "  <Tags>"
    echo "    <tag>$(echo "$TAGS" | sed 's/,/<\/tag>\n    <tag>/g')</tag>"
    echo "  </Tags>"
  fi
  if [ "$NOTE" ]; then
    echo "  <Note>"
    echo "    <note>$NOTE</note>"
    echo "    <isPublic>true</isPublic>"
    echo "  </Note>"
  fi
  echo "</Item>"
)" "https://api.merchantos.com/API/Account/71231/Item/$ID?oauth_token=$TOKEN"
