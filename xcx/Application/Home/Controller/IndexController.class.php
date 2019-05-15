<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {

    public function index(){
       echo 'happy!';
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
	   // 上传成功
	     /*$baesURL = 'Uploads/'.$info['savepath'].$info['savename'];
	     $pic_url = $baesURL;
	     $model = new Model('Message');
         $data = array(
            'message_name' => $message_name,
            'content' => $content,
            'pic_url' => $pic_url,
            'box_num' => $box_num,
            'take' => $take,
            'mark' => $mark,
            'created_tm' => $created_tm,
            'clock_tm' => $clock_tm,
            'light' => $light,
            'user_id' => $user_id
        );
        if (!($model->create($data) && $model->add()))
        {
            echo '0';
        }
        else 

       		echo '1';
	    

	   }*/
	   $Ocr  = A('Ocr');
       $Ocr->Ocr($baesURL);    
		}
    }

    public function read(){
        //字符读出
        $fp = fopen('C:\wamp\www\xcx\data.txt','r')or exit("Unable to open file!");
        $userdata = fread($fp,filesize('C:\wamp\www\xcx\data.txt'));
       // $userdata = iconv("gb2312", "utf-8", $userdata);  
        echo $userdata;
        fclose($fp);
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

    public function updatetxt(){
    	//header("Content-Type: text/html;charset=utf-8");
    	$content=@file_get_contents('C:\wamp\www\xcx\data.txt');
    	//$content = iconv("gb2312", "utf-8", $content);  
		if($content === false){
		    echo '无法读取文件内容';
		}else{
		    if(strlen($content) === 0){
		        echo '请输入内容!';
		    }else{
		        echo '不是空文件';
		        // 获取内容 然后处理
		  	//var_dump($content);

		       $content = preg_replace(array('<p class="xing-p">',"</p>"),array("P","P"),$content);
		       //$content  = iconv("GB2312", "utf-8",  $content );
		       //var_dump($content);
		       $content .='<style>div { text-align: justify; }</style><h2>标题</h2>'.$content;
		   //var_dump($content);
    		  
    		/*$txt = M('Test');
    		$data['ocrtxt'] = $content;
    	$txt->add($data);*/
		        $content  = <<<EOD
		        <h1>Welcome to <a href="http://www.tcpdf.org" style="text-decoration:none;background-color:#CC0000;color:black;">&nbsp;<span style="color:black;">TC</span><span style="color:white;">PDF</span>&nbsp;</a>!</h1>
<i>This is the first example of TCPDF library.</i>"$content"
EOD;
		      $pdf = A('Pdf');
		      echo $pdf->pdf($content);
		      //file_put_contents('C:\wamp\www\xcx\data.txt',''); 
		    }
		}
    }

    public function t(){
/*
    	$txt = M('Test');
    	$data = $txt->query('select *from test');
    	$data  = iconv("UTF-8", "UTF-8//IGNORE" ,$data );
    	$mpdf = A('Mpdf');
    	$da = '哈哈哈哈哈啊哈哈';
		 $mpdf = $mpdf->Mpdf($da);
    	var_dump($data);*/
    	//$a = I('date');

    	       /* $fp = fopen('C:\wamp\www\xcx\data.txt','a+')or exit("Unable to open file!");
        //$OcrTxt = iconv("utf-8","gb2312",  $OcrTxt);
        fwrite($fp, $a);
        fclose($fp);
    	var_dump($a);*/
    	$mysql = M('Dirary');
		$d[] = array(
			'openid' => 'openid',
			'title' => 'title',
			'ctime' => 'time',
			'content' => 'data',
			'pointnb' =>'0',
			'isopen' =>'1',
			'pdfurl' =>'pdfurl'
			);
		$mysql->addall($d);
    }

    public function tt(){
    	//xing-eidtor wx.request 将图文信息存入存入数据库 调用生成pdf方法，生成pdf 并存入路径
    	$str = I('d');// xing-eidtor wx.request 返回的图文信息
    	$openid = I('openid');
    	$title = I('title');
    	$time = date ( "Y-m-d H:i:s" );
    	$content = htmlspecialchars_decode($str);
		$a = json_decode($content,true);
		$data = '<h1>'.$title.'</h1>';
		$i = 0;
		if($openid =='') return ;
		foreach ($a as $key => $value) {
			# code...
			if($value['name'] == 'p') {
				//text 文本
				$data.= '<p>'.$value['children']['0']['text'].'</p>';
			}else{
				//图片地址
				  $data .= '<img src="'.$value['attrs']['src'].'" border="0" height="50" width="50" align="bottom" />';
			}
		}
	/*	$data = <<<EOD
				"$data"
EOD	;*/
		$pdf = A('Pdf');
		$pdfurl = $pdf->pdf($title,$openid,$data,$time);

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
			$da = implode('',$data);
			$pdf = A('Pdf');
		    $pdf->pdf($title,$openid,$da,$time);
		}
		else
			echo '0';

	 }
}