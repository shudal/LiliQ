<?php
namespace app\index\controller;

class Admin {
    public function delC($data) {
        $c = model('comment')->where('id', $data['id'])->where('status', '<>', -1)->find();
        if ($c != null) {
            $c->status = -1;
            $c->save();
            $p = model('post')->where('id', $c->postid)->where('status', "<>", -1)->find();
            if ($p != null) {
                $p->cvol -= 1;
                $p->save();
            }
        }
    }

    public function delComment() {
        if (!request()->isGet()) {
            return 'hi';
        }
        $data = input('get.');
        if (!empty($data['postid'])) {
            $cs = model('comment')->where('postid', '=', $data['postid'])->where('status', '<>', -1)->select();
            for ($i=0; $i < count($cs); ++$i) {
                $d = [
                    'id' => $cs[$i]->id
                ];
                self::delC($d);
            }
        }
        if (!empty($data['commentid'])) {
            $d = [
                'id' => $data['commentid']
            ];
            self::delC($d);
        }
        return apiReturn(0, "OK", "");
    }
    public function getComments() {
        $d = model('comment')->where('status', '<>', -1)->select();
        return apiReturn(0, "OK", $d);
    }
    public function delPost() {
        $data = input('get.');
        if (!empty($data['postid'])) {
            $p = model('post')->where('id',$data['postid'])->find();
            $p->status = -1;
            $p->save();
        }
        return apiReturn(0, "OK", "");
    }
}
