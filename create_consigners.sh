#!/bin/bash
set -e

function create {
  OUT="$(curl --user 3c9830eea3fa5afd760748ac941feb1a0b97c890f94734c6b16b7d036e816e4d:apikey --data '{"firstName": "'"$1"'", "customerTypeID": "6"}' 'https://api.merchantos.com/API/Account/71231/Customer.json')"
  if [ "$(echo "$OUT" | grep '{"count":"1"}')" ]; then
    echo "created $1."
  elif [ "$(echo "$OUT" | grep "HTTP/1.1 503")" ]; then
    echo "Waiting 60 seconds due to API throttling."
    sleep 60
    create "$1"
  else
    echo FAILED
    echo "$OUT"
    exit 1
  fi
}

create "Lili Graffiti"
create "Sartoria"
create "A-Else"
create "Oiselle"
create "Jessup"
create "Coloré"
create "Cadeauté"
create "Pas de ChiChi"
create "Home Baked"
create "Dot & Lil"
create "Live Beautiful"
create "Shtukanchiki"
create "Coca Bella"
create "Sonia Vintage"
create "Les Enfants Sauvages"
create "Betina Lou"
create "Bohten"
create "dushonok"
create "bitesize"
create "Debora Adams"
create "Guillola"
