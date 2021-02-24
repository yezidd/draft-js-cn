const archiver = require('archiver');
const path = require('path');
const fs = require('fs');

buildAsset();

// 实现本地打包
function buildAsset() {
  const {spawn} = require('child_process');
  const ls = spawn('npm', ['run', 'build'], {
    cwd: path.resolve(__dirname, '../'),
  });

  ls.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });

  ls.on('close', code => {
    console.log(`打包完成，退出码 ${code};开始准备压缩资源`);
    buildTencentTxt();
  });
}
// 验证 腾讯 文件
function buildTencentTxt() {
  const {spawn} = require('child_process');
  const ls = spawn('touch', ['tencent867442159869097975.txt'], {
    cwd: path.resolve(__dirname, '../build'),
  });

  ls.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });

  ls.on('close', code => {
    console.log(`验证腾讯资源文件`);
    fs.writeFileSync(path.resolve(__dirname, '../build/tencent867442159869097975.txt'),"5057376130650055469",'utf-8');
    buildRobotTxt();
  });
}

// 新建robot.txt
function buildRobotTxt() {
  const {spawn} = require('child_process');
  const ls = spawn('touch', ['robots.txt'], {
    cwd: path.resolve(__dirname, '../build'),
  });

  ls.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });

  ls.on('close', code => {
    console.log(`建立robots.txt`);
    fs.writeFileSync(path.resolve(__dirname, '../build/robots.txt'),"User-agent: *\nAllow: *\nSitemap: https://draftjs.cn/sitemap.xml",'utf-8');
    zipAsset();
  });
}

// 压缩打包的产物 ----> 文件地址 build 文件夹
function zipAsset() {
  var archive = archiver('zip', {
    zlib: {level: 5}, //递归扫描最多5层
  }).on('error', function(err) {
    throw err; //压缩过程中如果有错误则抛出
  });

  var output = fs
    .createWriteStream(path.resolve(__dirname, '../rc.zip'))
    .on('close', function(err) {
      /*压缩结束时会触发close事件，然后才能开始上传，
       否则会上传一个内容不全且无法使用的zip包*/
      if (err) {
        console.log('关闭archiver异常:', err);
        return;
      }
      console.log('已生成zip包');
      console.log('开始上传public.zip至远程机器...');
      deletePreAsset();
    });

  archive.pipe(output); //典型的node流用法
  archive.directory(path.resolve(__dirname, '../build'), false); //将srcPach路径对应的内容添加到zip包中/public路径
  archive.finalize();
}

// 删除nginx里面所有的文件
function deletePreAsset() {
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
          rm -rf ./*
          exit
        `,
          )
          .on('close', function() {
            console.log('删除完成');
            uploadZip();
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

// 上传打包好的压缩文件
function uploadZip() {
  console.log('-开始将文件发送至服务器--');
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
      console.log('0-00连接上了吗');
      // 上传文件
      return sftp.put(
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
