#!/bin/bash
set -e

function create_parent {
  NAME="$1"
  OUT="$(curl --user "$(cat key)":apikey --data '{"name": "'"$NAME"'"}' 'https://api.merchantos.com/API/Account/71231/Category.json')"
  if [ "$(echo "$OUT" | grep '{"count":"1"}')" ]; then
    echo "created $NAME." 1>&2
    echo "$OUT" | sed 's/.*"categoryID":"\([^"]*\)".*/\1/g'
  elif [ "$(echo "$OUT" | grep '"httpCode":"503"')" ]; then
    echo "Waiting 60 seconds due to API throttling." 1>&2
    sleep 60
    create_parent "$1"
  else
    echo FAILED 1>&2
    echo "$OUT"
    exit 1
  fi
}

function create_child {
  PARENT_NAME="$1"
  PARENT_ID="$2"
  NAME="$3"
  OUT="$(curl --user "$(cat key)":apikey --data '{"name": "'"$NAME"'", "parentID": "'"$PARENT_ID"'"}' 'https://api.merchantos.com/API/Account/71231/Category.json')"
  if [ "$(echo "$OUT" | grep '{"count":"1"}')" ]; then
    echo "created $PARENT_NAME/$NAME."
  elif [ "$(echo "$OUT" | grep '"httpCode":"503"')" ]; then
    echo "Waiting 60 seconds due to API throttling."
    sleep 60
    create_child "$1" "$2" "$3"
  else
    echo FAILED
    echo "$OUT"
    exit 1
  fi
}

function create {
  PARENT_NAME="$1"
  PARENT_ID="$(create_parent "$PARENT_NAME")"; shift
  while [ "$1" ]; do
    create_child "$PARENT_NAME" "$PARENT_ID" "$1"; shift
  done
}

create "clothing" "dress" "blouse" "jacket" "jumper" "underwear" "shirt" "shorts" "skirt" "hosiery" "trousers" "jeans" "t-shirt" "sweater" "outerwear" "other"
create "footwear" "shoes" "boots" "other"
create "jewellery" "ring" "bracelet" "earrings" "necklace" "brooch" "other"
create "accessories" "eyewear" "neckwear" "belt" "bag" "handwear" "other"
create "home" "body care" "candle" "paper" "other"
