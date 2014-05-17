#!/bin/bash
CODE="$1"
APIKEY="$(cat secret)"
curl --data "client_id=garment_describer&client_secret=$SECRET&code=$CODE&grant_type=authorization_code&redirect_uri=http%3A%2F%2Fgelisam.com%2Fff%2FGarmentDescriber%2Foauth.php" https://cloud.merchantos.com/oauth/access_token.php
