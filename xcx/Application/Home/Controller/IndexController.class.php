<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {

    public function index(){
       echo 'happy!';
    }

    public function getopenid(){
    	$appid = I('appid');
    	$secret = I('secret');
    	$code = I('js_code');
    	$grant_type = I('grant_type');
    	$url = "https://api.weixin.qq.com/sns/jscode2session?appid=$appid&secret=$secret&js_code=$code&grant_type=authorization_code";
    	$info = file_get_contents($url);
    	$jsondecode=json_decode($info);
		$array=get_object_vars($jsondecode);
        echo $array['openid'];

    }

    //获取用户信息
    public function getuserinfo(){

	    $code = I('code');//小程序传来的code值
	    $nick = I('nick');//小程序传来的用户昵称
	    $imgUrl = I('avaurl');//小程序传来的用户头像地址
	    $sex = I('sex');//小程序传来的用户性别
	    $openid = I('openid');
	    $con = mysqli_connect('localhost', 'root', '');//连接数据库
	    if(!isset($openid)) return 0;
	    if ($con) {
	        if (mysqli_select_db($con, 'xcx')) {
	            $sql1 = "select * from userinfo where openid = '$openid'";
	            $result = mysqli_query($con, $sql1);
	            $result = mysqli_fetch_assoc($result);
	            if ($result!=null) {//如果数据库中存在此用户的信息，则不需要重新获取
	                $result = json_encode($result);
	                echo $result;

	            }
	            else {//没有则将数据存入数据库
	                if ($sex == '0') {
	                    $sex = 'none';
	                } else {
	                    $sex = '1' ? 'man' : 'women';
	                }
	                $sql = "insert into userinfo values ('$nick','$openid','$imgUrl','$sex')";
	                if (mysqli_query($con, $sql)) {
	                    $arr['nick'] = $nick;
	                    $arr['imgUrl'] = $imgUrl;
	                    $arr['sex'] = $sex;
	                    $arr = json_encode($arr);
	                    echo $arr;

	                } else {
	                    die('failed' . mysqli_error($con));
	                }
	            }
	        }
	    } else {
	        die(mysqli_error());
	    }
    }

    //文件上传
    public function upload(){

       $message = I('user');
	   $upload = new \Think\Upload(); // 实例化上传类
	   $upload->exts = array('jpg', 'bmp', 'gif', 'png', 'jpeg'); // 设置附件上传类型
	   $now = $_SERVER['REQUEST_TIME'];
	   $upload->saveName = array('uniqid',$now);//
	   $upload->maxsize = 2024000;//图片上传
	   $upload->rootpath = './Uploads/'; // 设置附件上传目录
	   $upload->savepath = '';
	   $info = $upload->uploadOne($_FILES['file']);
	   if (!$info)
	    {// 上传错误提示错误信息
	      echo '0';
	   }
	   else 
	   {
	   	$baesURL = 'C:\wamp\www\xcx\Uploads/'.$info['savepath'].$info['savename'];
	    $Ocr  = A('Ocr');
        $Ocr->Ocr($baesURL);    
		}
    }

    public function uploadimg(){ 
    	//被调用函数 上传图片返回地址信息
	   $upload = new \Think\Upload(); // 实例化上传类
	   $upload->exts = array('jpg', 'bmp', 'gif', 'png', 'jpeg'); // 设置附件上传类型
	   $now = $_SERVER['REQUEST_TIME'];
	   $upload->saveName = array('uniqid',$now);//
	   $upload->maxsize = 2024000;//图片上传
	   $upload->rootpath = './Uploads/'; // 设置附件上传目录
	   $upload->savepath = '';
	   $info = $upload->uploadOne($_FILES['file']);
	   if (!$info)
	    {// 上传错误提示错误信息
	      echo '0';
	   }
	   else 
	   {
	   	$baesURL = 'https://www.caption-he.com.cn/xcx/Uploads/'.$info['savepath'].$info['savename'];
  		echo $baesURL;
		}
    }


	 public function tomysql(){
	 	$str = I('d');
	 	$openid = I('openid');
    	$title = I('title');
    	$time = date ( "Y-m-d H:i:s" );
		$content = htmlspecialchars_decode($str);
		$a = json_decode($content,true);
		$data = array();
		$i = 0;
		if(!isset($openid)) return;
		$sql = M('Userinfo');
		$res = $sql -> query("select *from userinfo where openid = '$openid'");
		$nick = $res['0']['nick'];
		$imgurl = $res['0']['imgurl'];
		foreach ($a as $key => $value) {
			# code...
			if($value['name'] == 'p') {
				//text 文本
				//$data.= '<p>'.$value['children']['0']['text'].'</p>';
			}else{
				//图片地址
				  //$data .= '<img src="'.$value['attrs']['src'].'" border="0" height="50" width="50" align="bottom" />';
					$data[$i] = $value['attrs']['src'];
					$i++;
			}
		}					

		$cont = 0;
		for($j = 0;$j<count($data);$j++){
			if(strlen($data[$j]) == 80)
				$cont++;
		}
		if($cont == $i){
			$da = '<h1 align="center">'.$title.'</h1>';
			$contentjson = '';
			$point = 0;
			foreach ($a as $key => $value) {
			# code...
			if($value['name'] == 'p') {
				//text 文本
				   $da.= '<p>'.++$point.' : '.$value['children']['0']['text'].'</p>';
				   $contentjson .= '|'.$value['children']['0']['text'];
			}else{
				//图片地址
				   $da .= '<div align="center"><img src="'.$value['attrs']['src'].'" border="0" height="250" width="250" align="bottom" /></div>';
				   $contentjson .= '|'.$value['attrs']['src'];
			}
		}	
			$da .='<div align="right"><img src="C:\wamp\www\ThinkPHP\Library\Vendor\tcpdf\examples\images\tcpdf_logo3.jpg" border="0" height="86" width="86" align="center" /></div>';
			$pdf = A('Pdf');
		    $pdf->pdf($nick,$imgurl,$time,$title,$openid,$da,$time,$contentjson);
		}
		else
			echo '0';

	 }

	public function search(){
		//搜索数据库，展示日志列表
		$reback = array();
		$body = array();
		$contentjson = array();
		$mysql = M('Dirary');
		$result = $mysql -> query('select *from dirary');
		for($i = 0;$i < count($result); $i++){
			$openid = $result[$i]['openid'];
			$title = $result[$i]['title'];
			$ctime = $result[$i]['ctime'];
			$contents= $result[$i]['contentjson'];
			//$contents= mysql_real_escape_string($contents);
			$contentjson = explode('|', $contents);
			for($t=0;$t<count($contentjson);$t++){
				if(file_get_contents($contentjson[$t])){
					$body[$t]['img'] = $contentjson[$t];
				}
				elseif($contentjson[$t]==''){}else{
					$body[$t]['p'] = $contentjson[$t];
				}
			}
			$pointnb = $result[$i]['pointnb'];
			$pdfurl = $result[$i]['pdfurl'];
			$id = $result[$i]['id'];
			$sql = M('Userinfo');
			$res = $sql -> query("select *from userinfo where openid = '$openid'");
			$nick = $res['0']['nick'];
			$imgurl = $res['0']['imgurl'];
			$reback[$i] = array($id,$nick,$imgurl,$title,$body,$ctime,$pointnb,$pdfurl);
			$body = array();
			$contentjson = array();
		}
		$data = array();
		for($i = 0;$i<count($reback);$i++){
			$data[$i]['meta']['id'] = $reback[$i][0];
			$data[$i]['meta']['avatar'] = $reback[$i][2];
			//$data[$i]['meta']['cover'] = $reback[$i][1];
			$data[$i]['meta']['cover'] = 'https://www.caption-he.com.cn/xcx/face.png';
			$data[$i]['meta']['create_time'] = $reback[$i][5];
			$data[$i]['meta']['nickName'] = $reback[$i][1];
			$data[$i]['meta']['title'] = $reback[$i][3];
			$data[$i]['meta']['pdfurl'] = $reback[$i][7];
			for($j=0;$j<=count($reback[$i][4]);$j++){
				foreach ($reback[$i][4][$j] as $index => $value){
					if($index == 'p'){
						$data[$i]['list'][$j]['commentNum'] = $j;
						$data[$i]['list'][$j]['type'] = "TEXT";
						$data[$i]['list'][$j]['content'] = $value;

					}else{
						$data[$i]['list'][$j]['commentNum'] = $j;
						$data[$i]['list'][$j]['type'] = "IMAGE";
						$data[$i]['list'][$j]['content'] = $value;
					}
				}
			}

		}
		echo(json_encode($data,true));  
	}

	public function idsearch(){
		$id = I('id');
		$mysql = M('Dirary');
		$data = array();
		$result = $mysql -> query("select *from dirary where id ='$id'");
		for($i = 0;$i < count($result); $i++){
			$title = $result[$i]['title'];
			$ctime = $result[$i]['ctime'];
			$openid = $result[$i]['openid'];
			$sql = M('Userinfo');
			$res = $sql -> query("select *from userinfo where openid = '$openid'");
			$nick = $res['0']['nick'];
			$imgurl = $res['0']['imgurl'];
			$data = array('title'=>$title,'time'=>$ctime,'nick'=>$nick,'imgurl'=>$imgurl);
		}

		echo(json_encode($data,true));  
	}

	public function del(){
		//entry页面的del方法
		//$openid = I('openid');
		$id = I('id');
		if($id == null) return;
		$sql = M('Dirary');
		$result = $sql -> execute("delete from dirary where id = '$id'");
		echo $result;
	}
}