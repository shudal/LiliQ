<?php
namespace app\index\controller;

class Dan
{
    public function index()
    {

    }
    public function score() {
        $data = input('get.');
        $data['ip'] = request()->ip();
        model('dans')->save($data);
        return 'ok';
    }
}
