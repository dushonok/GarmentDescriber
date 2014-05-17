#!/bin/bash
set -e

function create {
  OUT="$(curl --user "$(cat key)":apikey --data '{"name": "'"$1"'"}' 'https://api.merchantos.com/API/Account/71231/Vendor.json')"
  if [ "$(echo "$OUT" | grep '{"count":"1"}')" ]; then
    echo "created $1."
  elif [ "$(echo "$OUT" | grep "HTTP/1.1 503")" ]; then
    echo "Waiting 60 seconds due to API throttling."
    sleep 60
    delete "$1"
  else
    echo FAILED
    echo "$OUT"
    exit 1
  fi
}


create "Les Enfants Sauvages"
create "Betina Lou"
create "Bohten"
create "DIY Couture"
create "IOU"
create "Meemoza"
create "Komodo"
create "Goodone"
create "Rachel F"
create "Uranium"
create "Norwegian Wood"
create "PACT"
create "Bolilaine"
create "Green Bijoux"
create "Bellemine"
create "3D Rings"
create "Papiroga"
create "Crowned Bird"
