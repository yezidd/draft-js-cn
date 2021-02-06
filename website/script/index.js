//

// // 打包
//

// //执行tar.sh脚本获取输出流
// let pro = cp.exec('npm run build', error => {
//   if (error) {
//     console.log(error);
//   }
// });

// pro.stdout.pipe(process.stdout);
// pro.on('exit', () => {
//   //打包完成后上传
//   // 上传
//   console.log('打包完成');

// });

// // 连接服务器上传
// function connect() {

// }

const path = require('path');
const fs = require('fs');

console.log(path.resolve(__dirname, '../rc.zip'));

uploadZip();

// uploadZip();

// 实现本地打包
function buildAsset() {
  const {spawn} = require('child_process');
  const ls = spawn('npm', ['run', 'build'], {
    swd: path.resolve(__dirname, '../'),
  });

  ls.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });

  ls.on('close', code => {
    console.log(`打包完成，退出码 ${code};开始准备压缩资源`);
    zipAsset();
  });
}

// 压缩打包的产物 ----> 文件地址 build 文件夹
function zipAsset() {
  console.log('-开始压缩资源-');
  const {spawn} = require('child_process');
  const ls = spawn('zip', ['../rc.zip', './*'], {
    cwd: path.resolve(__dirname,'../build'),
  });

  ls.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });

  ls.on('close', code => {
    console.log('-压缩完成，开始发送至服务器-');
    uploadZip();
  });
}

// 上传打包好的压缩文件
function uploadZip() {
  console.log('-开始将文件发送至服务器-');
  const ClientSftp = require('ssh2-sftp-client');
  let sftp = new ClientSftp();
  sftp
    .connect({
      host: '47.98.158.20', // 服务器 IP
      port: '22',
      username: 'root',
      password: 'Yjs10086',
    })
    .then(() => {
      console.log('0-00连接上了吗')
      // 上传文件
      return sftp.fastPut(
        path.resolve(__dirname, '../rc.zip'),
        '/root/draft/www/rc.zip',
      );
    })
    .then(data => {
      console.log('-文件发送完成,目标目录/root/draft/www/-');
      sftp.end();
      deployAssest();
    })
    .catch(err => {
      console.log(err, 'catch error');
    });
}
// 解压压缩文件并且部署
function deployAssest() {
  var Client = require('ssh2').Client;
  var conn = new Client();
  conn
    .on('ready', function() {
      conn.shell(function(err, stream) {
        if (err) {
          console.log(err);
          throw err;
        }
        stream
          .end(
            `
          cd /root/draft/www
          ls
          rm -rf !rc.zip
          unzip rc.zip
          rm -rf rc.zip
          exit
        `,
          )
          .on('close', function() {
            console.log('部署完成');
            conn.end();
          })
          .on('data', function(data) {
            console.log('OUTPUT: ' + data);
          });
      });
    })
    .connect({
      host: '47.98.158.20',
      port: 22,
      username: 'root',
      password: 'Yjs10086',
    });
}
