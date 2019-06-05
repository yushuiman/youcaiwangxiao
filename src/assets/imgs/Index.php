<?php
namespace app\upload\controller;
use OSS\Core\OssException;
use OSS\OssClient;
use think\Controller;
use think\Image;
use think\validate;
use think\File;
use think\Response;
use think\captcha\Captcha;

/**
 * @title 文件上传
 */
class Index  {
  
    /**
     * @title 上传图片
     * @desc  {"0":"接口地址：http://ycapi.youcaiwx.com/upload/Index/uploadImage","1":"请求方式：post","2":"接口备注：必须传入keys值用于通过加密验证"}
     * @param {"name":"image","type":"str","required":true,"default":"3","desc":"图片"}
     * @return {"name":"code","type":"int","required":true,"desc":"返回码：200成功","level":1}
     * @return {"name":"msg","type":"string","required":true,"desc":"返回信息","level":1}
     * @return {"name":"data","type":"array","required":true,"desc":"返回数据","level":1}
     * @return {"name":"image_url","type":"string","required":true,"desc":"图片地址","level":2} 
     */
        public function uploadImage(){
		$file = request()->file('image');  //获取到上传的文件
		
        $resResult = Image::open($file);
        $info = $file->check(['size'=>1024*1024*6,'ext'=>'jpg,jpeg,png,gif']);
        if(!$info){
            $data = json(['code'=>405,'msg'=>'操作失败','data'=>$file->getError()]);
            return $data;
        } 
      
        // 尝试执行
        try {
            $config = Config('oss'); //获取Oss的配置
            //实例化对象 将配置传入
            
            $ossClient = new \OSS\OssClient($config['KeyId'], $config['KeySecret'], $config['Endpoint']);
            //var_DumP($ossClient);die;
            //这里是有sha1加密 生成文件名 之后连接上后缀
            //$fileName = sha1(date('YmdHis', time()) . uniqid()) . '.' . $resResult->type();
            $fileName = "style/images/".date('Ymd')."/".md5(time() . rand(1,999999999))."." . $resResult->type();
            //执行阿里云上传
            $result = $ossClient->uploadFile($config['Bucket'], $fileName, $file->getInfo()['tmp_name']);
            /**
             * 这个只是为了展示
             * 可以删除或者保留下做后面的操作
             */
            $arr['image_url'] =  $result['info']['url'];
            
        } catch (OssException $e) {
            $data = json(['code'=>405,'msg'=>'操作失败','data'=>$e->getMessage()]);
            return $data;
        }
        //将结果输出
       // dump($arr);
        $data = json(['code'=>200,'msg'=>'操作成功','data'=>$arr]);
            return $data;
        
    }

    /**
     * @title 上传pdf文件
     * @desc  {"0":"接口地址：http://ycapi.youcaiwx.com/upload/Index/uploadFile","1":"请求方式：post","2":"接口备注：必须传入keys值用于通过加密验证"}
     * @param {"name":"file","type":"str","required":true,"default":"3","desc":"图片"}
     * @return {"name":"code","type":"int","required":true,"desc":"返回码：200成功","level":1}
     * @return {"name":"msg","type":"string","required":true,"desc":"返回信息","level":1}
     * @return {"name":"data","type":"array","required":true,"desc":"返回数据","level":1}
     * @return {"name":"file_url","type":"string","required":true,"desc":"pdf地址","level":2} 
     */
     public function uploadFile(){
        $file = request()->file('file');  //获取到上传的文件
       //$resResult = File::open($file);
        $info = $file->check(['size'=>1024*1024*6,'ext'=>'pdf']);
        if(!$info){
            $data = json(['code'=>405,'msg'=>'操作失败','data'=>$file->getError()]);
            return $data;
        } 
        $res = $file->getInfo();
        $type= explode('/',$res['type']);

        
        // 尝试执行
        try {
            $config = Config('oss'); //获取Oss的配置
            //实例化对象 将配置传入
            
            $ossClient = new \OSS\OssClient($config['KeyId'], $config['KeySecret'], $config['Endpoint']);
            //var_DumP($ossClient);die;
            //这里是有sha1加密 生成文件名 之后连接上后缀
            //$fileName = sha1(date('YmdHis', time()) . uniqid()) . '.' . $resResult->type();
            $fileName = "style/pdf/".date('Ymd')."/".md5(time() . rand(1,999999999))."." . $type[1];
            //执行阿里云上传
            $result = $ossClient->uploadFile($config['Bucket'], $fileName, $file->getInfo()['tmp_name']);
            /**
             * 这个只是为了展示
             * 可以删除或者保留下做后面的操作
             */
            $arr['file_url'] =  $result['info']['url'];
            
        } catch (OssException $e) {
            return $e->getMessage();
            $data = json(['code'=>405,'msg'=>'操作失败','data'=>$e->getMessage()]);
            return $data;
        }
        //将结果输出
        //dump($arr);
        $data = json(['code'=>200,'msg'=>'操作成功','data'=>$arr]);
            return $data;
    }



    /**
     * @title 获取图片验证码
     * @desc  {"0":"接口地址：http://ycapi.youcaiwx.com/upload/Index/showCaptcha","1":"请求方式：get","2":"接口备注：必须传入keys值用于通过加密验证"}
     * @return {"name":"code","type":"int","required":true,"desc":"返回码：200成功","level":1}
     * @return {"name":"msg","type":"string","required":true,"desc":"返回信息","level":1}
     * @return {"name":"data","type":"array","required":true,"desc":"返回数据","level":1} 
     */
    
    public function showCaptcha(){
        $params = input();

        $config =    [
            
            // 验证码位数
            'length'      =>    4,   
            // 关闭验证码杂点
            'useNoise'    =>    true,
            'expire'      => 60, // 过期时间
 
        ];
        $captcha = new Captcha($config);
        return $captcha->entry();
    }


    /**
     * @title 检测图片验证码是否正确
     * @desc  {"0":"接口地址：http://ycapi.youcaiwx.com/upload/Index/checkCaptcha","1":"请求方式：post","2":"接口备注：必须传入keys值用于通过加密验证"}
     * @param {"name":"captcha","type":"str","required":true,"default":"3","desc":"验证码"}
     * @return {"name":"code","type":"int","required":true,"desc":"返回码：200成功","level":1}
     * @return {"name":"msg","type":"string","required":true,"desc":"返回信息","level":1}
     * @return {"name":"data","type":"array","required":true,"desc":"返回数据","level":1} 
     */
    public function checkCaptcha(){
        $data = input();
        $captcha = new Captcha();
        $status= $captcha->check($data['captcha']);
        
        if($status){
            $data = json(['code'=>200,'msg'=>'操作成功','data'=>[]]);
            return $data;
        }else{
            $data = json(['code'=>408,'msg'=>'验证码错误','data'=>[]]);
            return $data;
        }


    }

}

