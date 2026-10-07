const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const dist=path.resolve(__dirname,'../dist'),qa=__dirname;
const types={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.mp3':'audio/mpeg'};
http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const review=pathname.startsWith('/_qa/'),root=review?qa:dist;
  const relative=review?pathname.slice(5):(pathname==='/'?'index.html':pathname.slice(1));
  const file=path.resolve(root,relative);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'}).end(data);});
}).listen(8774,'127.0.0.1',()=>console.log('Game: http://127.0.0.1:8774/ · Missions: http://127.0.0.1:8774/_qa/playtest.html'));
