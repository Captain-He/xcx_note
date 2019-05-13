<?php
namespace Home\Model;

use Think\Model\ViewModel;
class UserinfoViewModel extends ViewModel
{
	public $viewFields = array(
		'userinfo'  => array('nick','openid','imgUrl','sex')
		);
}