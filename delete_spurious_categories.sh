#!/bin/bash
set -e

function delete {
  OUT="$(curl --user 3c9830eea3fa5afd760748ac941feb1a0b97c890f94734c6b16b7d036e816e4d:apikey -I -X DELETE 'https://api.merchantos.com/API/Account/71231/Vendor/'"$1")"
  if [ "$(echo "$OUT" | grep "HTTP/1.1 200")" ]; then
    echo "deleted $1."
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

for x in `seq 224 330 | grep '[02468]$'`; do
  delete "$x"
done
