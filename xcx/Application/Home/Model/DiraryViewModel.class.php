<?php
namespace Home\Model;

use Think\Model\ViewModel;
class DiraryViewModel extends ViewModel
{
	public $viewFields = array(
		'dirary'  => array('openid','title','ctime','content','pointnb','isopen','pdfurl','contentjson')
		);
}