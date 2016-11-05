var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;
var crypto=require('crypto');
var config={
	user:'postgres',
	database:'mydb1',
	host:'127.0.0.1',
	port:'5432',
	password:'postgres'
};
var app = express();
app.use(morgan('combined'));
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
	return hashed.toString('hex');
}
app.get('/hash/:input',function(req,res){
	var salt='this-is-some-random-string';
	var hashedString=hash(req.params.input,salt);
	res.send(hashedString);
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
