<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 流年 <liu21st@gmail.com>
// +----------------------------------------------------------------------

// 应用公共文件

function apiReturn($status, $message, $data=[])
{
    $result = [
        'code'  => $status,
        'msg' => $message,
        'data'    => $data,
    ];
    return json($result);
}
function curl_get_https($url){
		$curl = curl_init(); // 启动一个CURL会话
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_HEADER, 0);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); // 跳过证书检查
		//curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, true);  // 从证书中检查SSL加密算法是否存在
		$tmpInfo = curl_exec($curl);     //返回api的json对象
		//关闭URL请求
		curl_close($curl);
		return $tmpInfo;    //返回json对象
	}

