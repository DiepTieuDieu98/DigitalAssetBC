<?php

require_once(__DIR__. '/vendor/autoload.php');

header('Content-type: text/plain');

$zip = new ZipArchive();
$zip->open("file.zip", ZIPARCHIVE::CREATE);
$zip->setPassword($_POST["password"]);

for ($a = 0; $a < count($_FILES["files"]["name"]); $a++)
{
    $content = file_get_contents($_FILES["files"]["tmp_name"][$a]);
    $zip->addFromString($_FILES["files"]["name"][$a], $content);
    $zip->setEncryptionName($_FILES["files"]["name"][$a], ZipArchive::EM_AES_256);
}
$zip->close();