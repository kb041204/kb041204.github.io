<?php
if($account == "lord" && $password == "pass"){
 echo "歡迎 $_POST[account]";
 echo "\n以上登入插件來自互聯網";
}elseif($_POST[account] == "ktmc" && $_POST[password] == "ict"){
 $y = date("Y");
 $m = date("m");
 $d = date("d");
 echo "歡迎, 今天是".$y."年".$m."月".$d."日";
 echo '<BR><BR><img src="YY.jpg"/>';
}else{
 echo "登入失敗\n";
 echo "以上登入插件來自互聯網";
}
?>