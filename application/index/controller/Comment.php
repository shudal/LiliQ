<?php
namespace app\index\controller;

class Comment {
    public function add() {
        $data = input('post.');

        $user = model('user')->where('openid', $data['userid'])->field("nickname,avaid,gender")->find();
        $data['nickname'] = $user->nickname;
        $data['avaid'] = $user->avaid;
        $data['gender'] = $user->gender;
        $data['cretime'] = strtotime('now');
        model('comment')->save($data);
        model('post')->where('id', $data['postid'])->setInc('cvol');
        return apiReturn(0, "OK", "");
    }
    public  function inc() {
        $data = input('post.');

        model('comment')->where('id', $data['id'])->setInc($data['field'], $data['n']);
        return apiReturn(0, "OK", "");

    }
}
