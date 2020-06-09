<?php
define('ROOT', 'C:\xampp\htdocs\hdwallets');
require_once(ROOT. '/vendor/autoload.php');

header('Content-type: text/plain');

if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
	$name = uniqid();
	$zip = new ZipArchive();
	$zip->open("asset_".$name.".zip", ZIPARCHIVE::CREATE);
	$zip->setPassword($_POST["pass_encrypt"]);

	$content = file_get_contents($_FILES["file_encrypt"]["tmp_name"]);
	$zip->addFromString($_FILES["file_encrypt"]["name"], $content);
	$zip->setEncryptionName($_FILES["file_encrypt"]["name"], ZipArchive::EM_AES_256);

	$zip->close();
	header("Location:http://localhost/hdwallets/AssetCopyRight/AssetCopyRight_Success.php");	
}
