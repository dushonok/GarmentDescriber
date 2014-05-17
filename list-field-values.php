<?php

$key_mapping = array(
  "Category"      => array("id" => "categoryID",      "url" => "Category",     "name" => "fullPathName"),
  "TaxClass"      => array("id" => "taxClassID",      "url" => "TaxClass",     "name" => "name"),
  "ItemMatrix"    => array("id" => "itemMatrixID",    "url" => "ItemMatrix",   "name" => "description"),
  "Manufacturer"  => array("id" => "manufacturerID",  "url" => "Manufacturer", "name" => "name"),
  "Vendor"        => array("id" => "vendorID",        "url" => "Vendor",       "name" => "name"),
  "Consignors"    => array("id" => "customerID",      "url" => "Customer",     "name" => "firstName"),
);

$key = $_GET['key'];

if (!array_key_exists($key, $key_mapping)) {
  print "Invalid field key '$key'.";
  exit;
}

header('Access-Control-Allow-Origin: *');

// based on http://benalman.com/projects/php-simple-proxy/

$i = $key_mapping[$key]["id"];
$u = $key_mapping[$key]["url"];
$n = $key_mapping[$key]["name"];
$url = "https://api.merchantos.com/API/Account/71231/$u.json?limit=1000";
if ($key == "Consignors") {
  $url = "https://api.merchantos.com/API/Account/71231/Customer.json?customerTypeID=6";
}

function getJson($url) {
  $token = trim(file_get_contents("private/token"));
  $ch = curl_init("$url&oauth_token=$token");
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  #$apikey = trim(file_get_contents("private/key"));
  #curl_setopt($ch, CURLOPT_USERPWD, "$apikey:apikey");
  $s = curl_exec($ch);
  if (curl_errno($ch) != 0) {
    $msg = curl_error($ch);
    header("HTTP/1.1 500 $msg");
    exit();
  }
  $data = json_decode($s, true);
  curl_close($ch);
  if (array_key_exists("httpMessage", $data)) {
    $msg = $data["httpMessage"];
    header("HTTP/1.1 500 $msg");
    exit();
  }
  return $data;
}

$data = getJson($url);

$r = array();
if (array_key_exists($u, $data)) {
  $data = $data[$u];
  if (!array_key_exists(0, $data)) {
    // workaround Lightspeed bug when there is only one item
    $data = array($data);
  }
  
  foreach($data as $desc) {
    $id = $desc[$i];
    $name = $desc[$n];
    if ($u == "ItemMatrix") {
      $itemAttributeSetID = $desc["itemAttributeSetID"];
      $axes_info = getJson("https://api.merchantos.com/API/Account/71231/ItemAttributeSet/$itemAttributeSetID.json?x=1");
      $axes_info = $axes_info["ItemAttributeSet"];
      
      $axes = array();
      for($i=1; $i<=3; ++$i) {
        if ($axes_info["attributeName$i"]) {
          $axes[$i-1] = $axes_info["attributeName$i"];
        } else {
          break;
        }
      }
      
      $r["$id:$itemAttributeSetID"] = array("name" => $name, "axes" => $axes);
    } else {
      $r[$id] = $name;
    }
  }
}

if (empty($r)) {
  print "{}";
} else {
  print str_replace("\\/", "/", json_encode($r));
}

?>
