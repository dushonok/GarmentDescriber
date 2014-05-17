#!/bin/bash
set -e

function delete {
  OUT="$(curl --user "$(cat key)":apikey -I -X DELETE 'https://api.merchantos.com/API/Account/71231/Vendor/'"$1")"
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
