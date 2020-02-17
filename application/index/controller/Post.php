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
        if (!empty($data['alladd'])) {
            $p->alladd = $data['alladd'];
        }
        if (!empty($data['type'])) {
            $p->ttype = $data['type'];
            // corse
            if ($data['type'] == 2) {
                $p->year = $data['year'];
                $p->coursename = $data['coursename'];
                $p->teacher = $data['teacher'];
            }
        }
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

    public function search() {
        $data = input('get.');
        $page = $data['page'];
        $pageSize = $data['size'];
        $ids = array();
        $c = 0;

        $whereData = [];
        $whereData[] = ['status', '=', 1];
        if (!empty($data['type']) && $data['type'] != "") {
            $whereData[] = ['ttype', '=', $data['type']];
            if ($data['type'] == config('code.TYPE_COURSE')) {
                if (!empty($data['year'])) {
                    $whereData[] = ['year', '=', $data['year']];
                }
                if (!empty($data['coursename'])) {
                    $whereData[] = ['coursename', 'like', "%".$data['coursename']."%"];
                }
                if (!empty($data['teacher'])) {
                    $whereData[] = ['teacher', 'like', "%".$data['teacher']."%"];
                }
            }
        }
        if (!empty($data['content'])) {
            $whereData[] = ['content', 'like', "%" . $data['content'] . "%"];
        }

        $list = model('post')->where($whereData)->field("id,nickname,content,img,openid,cretime,userid,gender,rvol,gvol,cvol,alladd,ttype,coursename,teacher,year")->order('id', 'desc')->paginate($pageSize, false, [
            "page" => $page
        ]);
        $listLen = count($list);
        for ($i = 0; $i < $listLen; ++$i) {
            $list[$i]['cretime'] = date('Y年m月d日 H:i', $list[$i]['cretime']);
            $ids[] = $list[$i]['id'];
            $list[$i]['type'] = $list[$i]['ttype'];
        }
        $a = model('post')->where('id', 'in', $ids)->setInc('rvol');
        //dump($a);
        return apiReturn(0,"OK", $list);

    }
    public function all() {
        $data = input('get.');
        $page = $data['page'];
        $pageSize = $data['size'];
        $ids = array();
        $c = 0;
        $list = model('post')->where('status','=',1)->field("id,nickname,content,img,openid,cretime,userid,gender,rvol,gvol,cvol,alladd,ttype,coursename,teacher,year")->order('id', 'desc')->paginate($pageSize, false, [
            "page" => $page
        ]);
        $listLen = count($list);
        for ($i = 0; $i < $listLen; ++$i) {
            $list[$i]['cretime'] = date('Y年m月d日 H:i', $list[$i]['cretime']);
            $ids[] = $list[$i]['id'];
            $list[$i]['type'] = $list[$i]['ttype'];
        }
        $a = model('post')->where('id', 'in', $ids)->setInc('rvol');
        //dump($a);
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
        $post = model('post')->where('id', $data['postid'])->field("id,nickname,content,img,openid,cretime,userid,gender,rvol,gvol,cvol,alladd,ttype,coursename,teacher,year")->find();
        $post['cretime'] = date('Y年m月d日 H:i', $post['cretime']);
        $post['type'] = $post['ttype'];

        return apiReturn(0, "OK", $post);
    }
}
