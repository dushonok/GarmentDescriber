<?
$code = preg_replace("/[^\w\d ]/ui", '', $_GET["code"]);;
unlink("private/token-$code");

?>
<p>OK, you've been logged out. Click <a href="https://cloud.merchantos.com/oauth/authorize.php?response_type=code&client_id=garment_describer&scope=employee:all">here</a> if you want to log in again.</p>
