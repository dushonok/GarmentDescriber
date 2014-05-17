<?
# http://www.lightspeedretail.com/cloud/help/developers/api/oauth/

# debug
#file_put_contents("private/oauth.log", print_r(array("_GET" => $_GET, "_POST" => $_POST), true), FILE_APPEND);

$code = $_GET["code"];
file_put_contents("private/code", $code);


# Retrieving Access Token

$secret = trim(file_get_contents("private/secret"));
# curl --data "client_id=garment_describer&client_secret=$secret&code=$code&grant_type=authorization_code&redirect_uri=http%3A%2F%2Fgelisam.com%2Fff%2FGarmentDescriber%2Foauth.php" https://cloud.merchantos.com/oauth/access_token.php

$url = "https://cloud.merchantos.com/oauth/access_token.php";
$ch = curl_init( $url );

curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, array(
  "client_id" => "garment_describer",
  "client_secret" => $secret,
  "code" => $code,
  "grant_type" => "authorization_code",
  "redirect_uri" => "http%3A%2F%2Fgelisam.com%2Fff%2FGarmentDescriber%2Foauth.php"
));

//curl_setopt($ch, CURLOPT_HTTPHEADER, array('X-HTTP-Method-Override: CREATE'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$s = curl_exec($ch);
if (curl_errno($ch) != 0) {
  $msg = curl_error($ch);
  header("HTTP/1.1 500 $msg");
  print $msg;
  exit();
}
$r = json_decode($s, true);
curl_close($ch);
if (array_key_exists("error_description", $r)) {
  $msg = $r["error_description"];
  header("HTTP/1.1 500 $msg");
  print $msg;
  exit();
}

if (!array_key_exists("access_token", $r)) {
  $msg = "no oauth token received";
  header("HTTP/1.1 500 $msg");
  print $msg;
  exit();
}

$token = $r["access_token"];
file_put_contents("private/token", $code);
?>
