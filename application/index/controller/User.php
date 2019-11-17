<?php
namespace app\index\controller;

class User {
    public function login() {
        if (!request()->isPost()) {
            return 'hi';
        }
        $data = input('post.');
        $appid = config('qqapp.appid');
        $appsec = config('qqapp.appsecret');
        $theUrl = "https://api.q.qq.com/sns/jscode2session?appid=".$appid."&secret=".$appsec."&js_code=".$data['code']."&grant_type=authorization_code";
        $result = curl_get_https($theUrl);
        $result = json_decode($result);
        $user = model('user')->where('openid',$result->openid)->find();
        if ($user == null) {
            $ava = curl_get_https($data['avaurl']);
            $ava = "data:image/png;base64," . base64_encode($ava);
            $pimg = new \app\common\model\Pimg;
            $pimg->img = $ava;
            $pimg->status = 1;
            $pimg->save();

            $user = new \app\common\model\User;
            $user->nickname = $data['nickname'];
            $user->gender = $data['gender'];
            $user->avaid = $pimg->id;
            $user->openid = $result->openid;
            $user->cretime = strtotime("now");
            $user->save();
        }
        return apiReturn(0, "OK", $user);
    }
}
