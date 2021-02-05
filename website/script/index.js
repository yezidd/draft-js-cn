var Client = require('ssh2').Client;
 
// 打包
const cp=require('child_process')

//执行tar.sh脚本获取输出流
let pro=cp.exec("npm run build",(error)=>{
    if (error) {
        console.log(error)
    }
})

pro.stdout.pipe(process.stdout)
pro.on('exit',()=>{
//打包完成后上传
    // 上传
   console.log('打包完成')
   connect();
})

// 连接服务器上传
function connect(){
  var conn = new Client();
  conn.on('ready', function() {
    console.log('Client :: ready');
    conn.shell(function(err, stream) {
      if (err) {
        console.log(err)
        throw err;
      }
      stream.end(
        `
          cd /root/draft/www
          ls
          exit
        `
      ).on('close', function() {
        console.log('Stream :: close');
        conn.end();
      }).on('data', function(data) {
        console.log('OUTPUT: ' + data);
      });
    });
    
  }).connect({
    host: '47.98.158.20',
    port: 22,
    username: 'root',
    password:"Yjs10086"
  });
}




