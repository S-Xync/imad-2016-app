var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;
var crypto=require('crypto');
var bodyParser=require('body-parser');
var session=require('express-session');
var config={
	user:'s-xync',
	database:'s-xync',
	host:'db.imad.hasura-app.io',
	port:'5432',
	password:'db-s-xync-5758'
};
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
	secret:'someRandomValue',
	cookie:{maxAge:1000*60*60*24*30}
}));
// var articleName;
function createtemplate(data){
	var title=data.title;
	var heading=data.heading;
	var date=data.date;
	var content=data.content;
	var htmlTemplate=
			`<html>
				<head>
					<title>${title}</title>
					<link rel="stylesheet" type="text/css" href="/ui/style.css">
					<meta name="viewport" content="width=device-width,initial-scale=1"/>
				</head>
				<body>
					<div class="container">
						<div>
							<a href="/">Home</a>
						</div>
						<hr>
						<h2>${heading}</h2>
						<div>
							<h5>${date.toDateString()}</h5>
						</div>
						<div>
						${content}
						</div>
					</div>
				</body>
			</html>`;
	return htmlTemplate;

}
var counter=0;
app.get('/counter',function(req,res){
	counter=counter+1;
	res.send(counter.toString());
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
var pool=new Pool(config);
app.get('/test-db',function(req,res){
	pool.query('SELECT * FROM test',function(err,result){
		if (err) {
			res.status(500).send(err.toString());
		}else {
			res.send(JSON.stringify(result.rows));
		}
	});
});
function hash(input,salt){
	var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
	return ["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
}
app.get('/hash/:input',function(req,res){
	var salt='this-is-some-random-string';
	var hashedString=hash(req.params.input,salt);
	res.send(hashedString);
});
app.post('/create-user',function(req,res){
	var username = req.body.username;
	var password=req.body.password;
	var salt=crypto.randomBytes(128).toString('hex');
	var dbString=hash(password,salt);
	pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dbString],function(err,result){
		if(err){
			res.status(500).send(err.toString());
		}else{
			res.send('User succesfully created with username : '+username);
		}
	});
});
app.post('/login',function(req,res){
	var username=req.body.username;
	var password=req.body.password;
	pool.query('SELECT * FROM "user" WHERE username=$1',[username],function(err,result){
		if(err){
			res.status(500).send(err.toString());
		}else{
			if(result.rows.length===0){
				res.status(403).send("username/password incorrect");
			}else{
				var dbString=result.rows[0].password;
				var salt=dbString.split('$')[2];
				var hashedPassword=hash(password,salt);
				if(hashedPassword===dbString){
					req.session.auth={userId:result.rows[0].id};
					//{auth:{userId}}
					res.send('Credentials are correct!');
				}else{
					res.status(403).send("username/password incorrect");
				}
			}
		}
	});
});
app.get('/check-login',function(req,res){
	if (req.session&&req.session.auth&&req.session.auth.userId) {
		res.send('You are logged in: '+req.session.auth.userId.toString());
	}else{
		res.send('You are not Logged In');
	}
});
app.get('/logout',function(req,res){
	delete 	req.session.auth;
	res.send('You are logged out');
});
app.get('/ui/style.css', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/ui/main.js',function(req,res){
	res.sendFile(path.join(__dirname,'ui','main.js'));
});
names=[];
app.get('/submit-name/',function(req,res){//URL : "/submit-name?name=name1"
var name=req.query.name;
names.push(name);
res.send(JSON.stringify(names));
});
app.get('/ui/madi.png', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});
app.get('/articles/:articleName',function(req,res){
	pool.query(
		"SELECT * FROM article WHERE title=$1",[req.params.articleName],function(err,result){
		if (err) {
			res.status(500).send(err.toString());
		}	else {
			if (result.rows.length === 0) {
				res.status(404).send("Article Not Found");
			}else {
				var articleData=result.rows[0];
				res.send(createtemplate(articleData));
			}
		}
		});
});
var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
	console.log(`App listening on port ${port}!`);
});
