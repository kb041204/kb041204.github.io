<?php
if($account == "lord" && $password == "pass"){
 echo "�w�� $_POST[account]";
 echo "\n�H�W�n�J����Ӧۤ��p��";
}elseif($_POST[account] == "ktmc" && $_POST[password] == "ict"){
 $y = date("Y");
 $m = date("m");
 $d = date("d");
 echo "�w��, ���ѬO".$y."�~".$m."��".$d."��";
 echo '<BR><BR><img src="YY.jpg"/>';
}else{
 echo "�n�J����\n";
 echo "�H�W�n�J����Ӧۤ��p��";
}
?>