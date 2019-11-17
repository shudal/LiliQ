<?php
namespace app\index\controller;

class Movie
{
    public function index()
    {

        $ka = model('movie')->all();
        $result = [];
        $result["code"] = 1;
        $result["msg"] = "OK";
        $result["data"] = $ka;
        return json($result);
    }

    public function hello($name = 'ThinkPHP5')
    {
        return 'hello,' . $name;
    }
}
