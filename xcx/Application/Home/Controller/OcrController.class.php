<?php
namespace Home\Controller;
use Think\Controller;
class OcrController extends Controller{
	
	public function index(){
		echo 'ocr';
	}

    //识别主体
	public function Ocr($url){

		$appid = '1252123439';//填写你的appid
		$SecretId = 'AKIDzlIjwt1BG8kFVWfsCH7i3A1vazeFohaE'; //填写你的SecretId
		$SecretKey = 'ZkhRyGJ7g0FEyTjkV8WeYFhtpVw62iAN'; //填写你的SecretKey
		$bucket = 'CI_QCSRole';//填写你的万象优图bucket
		$signStr = $this->get_authorization($bucket, $appid, $SecretId, $SecretKey);
		$image = new \CurlFile($url);
		$res = $this->to_curl_image($appid, $image, $signStr ); 
		$length =  count($res[data][items]);
		for($i = 0; $i < $length; $i++)
		{
			$txt .= $res[data][items][$i][itemstring];
				
		}
		    //$txt = '<p class="xing-p">'.$txt.'</p>';
		   echo $txt;
		   // $this->write($txt);
		
	}

	    public function write($OcrTxt){
        //字符写入文件
        $fp = fopen('C:\wamp\www\xcx\data.txt','a+')or exit("Unable to open file!");
        //$OcrTxt = iconv("utf-8","gb2312",  $OcrTxt);
        fwrite($fp, $OcrTxt);
        fclose($fp);
    }
		//本地上传
		function to_curl_image($appid, $image, $signStr )
		{
			$content = array('appid' => $appid, 'image' => $image);
			$header[] = 'Host: recognition.image.myqcloud.com'; 
		    $header[] = 'Authorization: '.$signStr; 
		    $header[] = 'Content-Type: multipart/form-data;charset=utf-8'; 
			$ch = curl_init(); 
			curl_setopt($ch, CURLOPT_URL, 'http://recognition.image.myqcloud.com/ocr/general'); 
		    curl_setopt($ch, CURLOPT_HEADER, 0); 
		    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
		    curl_setopt($ch, CURLOPT_HTTPHEADER, $header); 
		    curl_setopt($ch, CURLOPT_POST, true); 
		    curl_setopt($ch, CURLOPT_POSTFIELDS, $content); 
		    $response = json_decode(curl_exec($ch), true); 
			return $response; 
		}
		//url方式上传
		function to_curl_url($appid, $url, $signStr )
		{
			$content = array('appid' => $appid, 'url' => $url);
			$header[] = 'Host: recognition.image.myqcloud.com'; 
		    $header[] = 'Authorization: '.$signStr; 
		    $header[] = 'Content-Type: multipart/form-data;charset=utf-8'; 
			$ch = curl_init(); 
			curl_setopt($ch, CURLOPT_URL, 'http://recognition.image.myqcloud.com/ocr/general'); 
		    curl_setopt($ch, CURLOPT_HEADER, 0); 
		    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
		    curl_setopt($ch, CURLOPT_HTTPHEADER, $header); 
		    curl_setopt($ch, CURLOPT_POST, true); 
		    curl_setopt($ch, CURLOPT_POSTFIELDS, $content); 
		    $response = json_decode(curl_exec($ch), true); 
			return $response; 
		}
		//获取authorization
		function get_authorization($bucket, $appid, $SecretId, $SecretKey)
		{	
			$expired = time() + 2592000;
			$onceExpired = 0;
			$current = time();
			$rdm = rand();
			$userid = "0";
			$fileid = "www.qcgzxw.cn";

			$srcStr = 'a='.$appid.'&b='.$bucket.'&k='.$SecretId.'&e='.$expired.'&t='.$current.'&r='.$rdm.'&u='
			.$userid.'&f=';
			
			$authorization = base64_encode(hash_hmac('SHA1', $srcStr, $SecretKey, true).$srcStr);
			return $authorization;
		}
	
}
?>