<?php
namespace app\index\controller;

class Post
{
    public function index() {
        return strtotime("now");
    }

    public function add()
    {
        if (!request()->isPost()) {
            return 'hi';
        }

        $data = input('post.');
        $user = model("user")->where('openid', $data['userid'])->find();

        $p = new \app\common\model\Post;
        $p->nickname = $data['nickname'];
        $p->content = $data['content'];
        $p->cretime = strtotime("now");
        $p->userid = $data['userid'];
        $p->gender = $user->gender;
        $p->img = "";
        $p->save();

        if (!empty($data['img'])) {

            $pimgs = [];
            $pimgs = explode("|", $data['img']);
            $imgLen = count($pimgs);
            for ($i=0; $i < $imgLen; ++$i) {
                $pimg = new \app\common\model\Pimg;
                $pimg->postid = $p->id;
                $pimg->img = $pimgs[$i];
                $pimg->status = 1;
                $pimg->save();

                $p->img = $p->img.$pimg->id;
                if ($i != $imgLen - 1) {
                    $p->img = $p->img."|";
                }
            }
            $p->save();
        }
        return apiReturn(0, "OK", []);
    }

    public function all() {
        if (!request()->isGet()) {
            return 'hi';
        }
        $data = input('get.');
        $page = $data['page'];
        $pageSize = $data['size'];
        $list = model('post')->where('status','neq',-1)->order('id', 'desc')->paginate($pageSize, false, [
            "page" => $page
        ])->each(function($item, $key) {
            $item['cretime'] = date('Y年m月d日 H:i', $item['cretime']);
        });
        return apiReturn(0,"OK", $list);
    }
    public function img() {
        if (!request()->isGet()) {
            return "hi";
        }

        $data = input('get.');
        if (!empty($data['userid'])) {
            $user = model("user")->where('openid', $data['userid'])->find();
            $data['imgid'] = $user->avaid;
        }
        $img = model('Pimg')->get($data['imgid']);
        return apiReturn(0,"OK",$img->img);
    }
}
