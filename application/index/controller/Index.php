<?php
namespace app\index\controller;

class Index
{

    public function index()
    {
        $ss = model('dans')->where('score', '<>', '1')->order('score', 'desc')->select();

        echo "<div><a href='https://perci-1253331419.cos.ap-chengdu.myqcloud.com/8.apk' style='font-size:30px'>点击下载 追逐南湖v2 安卓版</a></div>";
        echo "<div><a href='https://perci-1253331419.cos.ap-chengdu.myqcloud.com/11.zip' style='font-size:30px'>点击下载 追逐南湖v2 Windows版</a></div>";
        echo "<div><a href='https://heing.fun/8/' style='font-size:30px'>点击跳转到 追逐南湖 电脑网页版（加载很慢</a></div>";
        echo "<div>电脑版的控制：wsad移动，j攻击,k切换</div>";
        echo "<div>界面上方左边为分数，界面上方右边为血量。血量每5s恢复5</div>";
        echo "<div>移动人物或攻击，来追寻更高的分数趴</div>";
        echo "<div>Tip: 穿过初始界面的上方缺口，到达更辽阔的游戏世界</div>";
        echo "<div>已修复：Tip: 手机屏幕太小，看不到玩家射出的子弹效果，windows上可以看到子弹效果</div>";
        echo "<div>Tip: 玩家子弹射程较短</div>";
        echo "<div>Tip: 游戏结束将自动上传分数，请等待1~2s后返回主界面</div>";
        echo "<img src='/static/1.png' /><img src='/static/2.png' /><img src='/static/3.jpg' />";
        echo "<style> img { width: 50%; }</style>";
        echo "<div>";
        for ($i = 0; $i < count($ss); $i++) {
            unset($ss[$i]['id']);
            echo $ss[$i]['cretime'] . "玩家".$ss[$i]['name']."达成分数". $ss[$i]['score'];
            echo "<br/>";
        }
        echo "<div>";
        file_get_contents("http://qqapp.heing.fun/index/dan/score?score=1");
        echo "clicked " . count(model('dans')->where('score', '=', '1')->field('id')->select());
        //return "<center><img src='https://qqapp.heing.fun/static/two.png'></img></center>";
    }
}
