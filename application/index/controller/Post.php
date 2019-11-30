<?php
namespace app\index\controller;

class Post
{
    public function add()
    {
        $data = input('post.');
        $user = model("user")->where('openid', $data['userid'])->field("gender")->find();

        $p = new \app\common\model\Post;
        $p->nickname = $data['nickname'];
        $p->content = $data['content'];
        $p->cretime = strtotime("now");
        $p->userid = $data['userid'];
        $p->gender = $user->gender;
        $p->img = "";
        $p->alladd = $data['alladd'];
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
        $data = input('get.');
        $page = $data['page'];
        $pageSize = $data['size'];
        $list = model('post')->where('status','=',1)->field("id,nickname,content,img,openid,cretime,userid,gender,rvol,gvol,cvol,alladd")->order('id', 'desc')->paginate($pageSize, false, [
            "page" => $page
        ])->each(function($item, $key) {
            model('post')->where('id',$item['id'])->setInc('rvol');
            $item['cretime'] = date('Y年m月d日 H:i', $item['cretime']);
        });
        return apiReturn(0,"OK", $list);
    }
    public function img() {
        $data = input('get.');
        if (!empty($data['userid'])) {
            $user = model("user")->where('openid', $data['userid'])->field('avaid')->find();
            $data['imgid'] = $user->avaid;
        }
        $img = model('Pimg')->get($data['imgid']);
        return apiReturn(0,"OK",$img->img);
    }
    public function imgRaw() {
        if (!request()->isGet()) {
            return "hi";
        }

        $data = input('get.');
        if (!empty($data['userid'])) {
            $user = model("user")->where('openid', $data['userid'])->field('avaid')->find();
            $data['imgid'] = $user->avaid;
        }
        $img = model('Pimg')->get($data['imgid']);
        $arr = preg_split("/(,|;)/",$img->img);//分隔三部分，data:image/png  base64  后面一堆
        $base64Data = $arr[2];
        $arr2 = explode('/',$arr[0]);      //分割出图片格式
        $type = $arr2[1];
        $fileName = 'tupian.'.$type;      //拼接图片名称
        file_put_contents($fileName,base64_decode($base64Data));
        $img = file_get_contents($fileName);
        header("Content-Type:image/".$type.";text/html;charset=utf-8");
        echo $img;
        exit;
    }

    public function inc() {
        $data = input('post.');

        model('post')->where('id', $data['id'])->setInc($data['field'], $data['n']);
        return apiReturn(0, "OK", "");
    }
    public function comment() {
        $data = input('get.');
        $cs = model('comment')->where('postid', '=', $data['postid'])->where('status', '=', '1')->field("content,userid,nickname,avaid,cretime,gender,gvol")->select();
        for ($i=0; $i<count($cs); ++$i) {
            $cs[$i]['cretime'] = date('Y年m月d日 H:i', $cs[$i]['cretime']);
        }
        return apiReturn(0, "OK", $cs);
    }
    public function post() {
        $data = input('get.');
        $post = model('post')->where('id', $data['postid'])->field("id,nickname,content,img,openid,cretime,userid,gender,rvol,gvol,cvol,alladd")->find();
        $post['cretime'] = date('Y年m月d日 H:i', $post['cretime']);

        return apiReturn(0, "OK", $post);
    }
}
