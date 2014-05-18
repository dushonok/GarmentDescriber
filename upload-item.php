<?php

$code = preg_replace("/[^\w\d ]/ui", '', $_GET["code"]);;

$valid_IPs = json_decode(file_get_contents("private/ip_list"), true);
$ip = $_SERVER['REMOTE_ADDR'];
if (!in_array($ip, $valid_IPs)) {
  $msg = "Your IP $ip is not in the whitelist.";
  header("HTTP/1.1 403 $msg");
  print $msg;
  exit();
}

$key_mapping = array(
  "Cost"          => "defaultCost",
  "DefaultCost"   => "defaultCost",
  "Price"         => "Prices",
  "AvgCost"       => "avgCost",
  "Msrp"          => "msrp", // manufacturer recommended retail price
  "Tax"           => "tax", // bool
  "ItemType"      => "itemType", // "default", "non_inventory", "serialized_assembly", "assembly", "serialized", or "box"
  "Description"   => "description",
  "Year"          => "modelYear",
  "ModelYear"     => "modelYear",
  "Upc"           => "upc", // a standard SKU number.
  "Ean"           => "ean", // a standard SKU number.
  "SKU"           => "customSku",
  "Sku"           => "customSku",
  "CustomSku"     => "customSku",
  "ManufacturerSku" => "manufacturerSku",
  "CategoryID"    => "categoryID",
  "Category"      => "categoryID",
  "TaxClassID"    => "taxClassID",
  "TaxClass"      => "taxClassID",
  "ItemMatrixID"  => "itemMatrixID",
  "ItemMatrix"    => "itemMatrixID",
  "ManufacturerID" => "manufacturerID",
  "Manufacturer"  => "manufacturerID",
  "Note"          => "Note",
  "DefaultVendorID" => "defaultVendorID",
  "VendorID"      => "defaultVendorID",
  "Vendor"        => "defaultVendorID",
  "Quantity"      => "ItemShops",
  "ReorderPoint"  => "ItemShops",
  "ReorderLevel"  => "ItemShops",
  "Tags"          => "Tags",
);


$json = array();
$json["taxClassID"] = "2"; // "item" by default
foreach($key_mapping as $post_key => $json_key) {
  if (array_key_exists($post_key, $_POST)) {
    if ($json_key == "itemMatrixID") {
      $values = $_POST[$post_key]; // ["$matrixID:$attrSetID", $attr1, ...]
      list($itemMatrixID, $itemAttributeSetID) = explode(":", $values[0], 2 );
      
      $attrs = array("itemAttributeSetID" => $itemAttributeSetID);
      for($i=1; $i<=3; ++$i) {
        if ($values[$i]) {
          $attrs["attribute$i"] = $values[$i];
        }
      }
      
      $json["itemMatrixID"] = $itemMatrixID;
      $json["ItemAttributes"] = $attrs;
    } else if ($json_key == "ItemShops") {
      $json[$json_key] = array(
        "ItemShop" => array(
          "shopID" => "1",
          "qoh" => $_POST["Quantity"] ? $_POST["Quantity"] : "0",
          //"reorderPoint" => $_POST["reorderPoint"] ? $_POST["reorderPoint"] : "0",
          //"reorderLevel" => $_POST["reorderLevel"] ? $_POST["reorderLevel"] : "0",
        )
      );
    } else if ($json_key == "Prices") {
      $json[$json_key] = array(
        "ItemPrice" => array(
          "useType" => "Default",
          "amount" => $_POST[$post_key]
        )
      );
    } else if ($json_key == "Note") {
      // can only be done in XML?
    } else if ($json_key == "Tags") {
      // can only be done in XML
    } else {
      $json[$json_key] = $_POST[$post_key];
    }
  }
}


header('Access-Control-Allow-Origin: *');

// based on http://benalman.com/projects/php-simple-proxy/

$token = trim(file_get_contents("private/token-$code"));
$url = "https://api.merchantos.com/API/Account/71231/Item.json?oauth_token=$token";
$ch = curl_init( $url );

curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($json));

//curl_setopt($ch, CURLOPT_HTTPHEADER, array('X-HTTP-Method-Override: CREATE'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
#$apikey = trim(file_get_contents("private/key"));
#curl_setopt($ch, CURLOPT_USERPWD, "$apikey:apikey");
$s = curl_exec($ch);
if (curl_errno($ch) != 0) {
  $msg = curl_error($ch);
  header("HTTP/1.1 500 $msg");
  exit();
}
$r = json_decode($s, true);
curl_close($ch);
if (array_key_exists("httpMessage", $r)) {
  $msg = $r["httpMessage"];
  header("HTTP/1.1 500 $msg");
  exit();
}
curl_close($ch);

if (array_key_exists("Tags", $_POST) || array_key_exists("Note", $_POST)) {
  $itemID = $r["Item"]["itemID"];
  $tags = $_POST["Tags"];
  $note = $_POST["Note"];
  $output = array();
  $old_pwd = getcwd();
  chdir("/home1/carlosm5/public_html/gelisam/ff/GarmentDescriber/private");
  exec("/home1/carlosm5/public_html/gelisam/ff/GarmentDescriber/private/add_xml_stuff.sh " . escapeshellarg($itemID) . " " . escapeshellarg($tags) . " " . escapeshellarg($note), $output);
  chdir($old_pwd);
  $r["xml_output"] = $output;
}
print json_encode($r);
?>
