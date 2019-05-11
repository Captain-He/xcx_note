<?php
namespace Home\Model;

use Think\Model\ViewModel;
class TestViewModel extends ViewModel
{
	public $viewFields = array(
		'test'  => array('ocrtxt' )
		);
}