function Settings() {
}

Settings.getLogoutUrl = function() {
	return "logout.php";
}

Settings.loginUrl = "https://cloud.merchantos.com/oauth/authorize.php?response_type=code&client_id=garment_describer&scope=employee:all"
