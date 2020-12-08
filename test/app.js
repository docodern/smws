const express = require('express'),
      cookieParser = require('cookie-parser'), // needed cookie-parser
      bodyParser = require("body-parser"), // needed body-parser
      smws = require("smws"), // require smws
      app = express();

app.set('view engine', 'Eta');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

smws.config({
    languages: ['en','ru'],
    defaultLang: 'en',
});

app.post('/:lang/language', (req,res)=>{
    smws.switcher(req,res);
});
app.get('/', function (req, res) {

    smws.run(req, res, {
        page: 'index'
    });

});

app.get('/:lang', function (req, res) {

    smws.run(req, res, {
        page: 'index'
    });

});

app.get(smws.split('/:lang/:category'), function (req, res) {

    smws.run(req,res,{
        page: 'category',
        useParams: ['lang', 'category']
    });

});

app.get(smws.split('/:lang/:category/:subCategory'), function (req, res) {

    smws.run(req,res,{
        page: 'subCategory',
        useParams: ['lang', 'category', 'subCategory']
    });

});

app.listen(process.env.PORT || 3000, () => {
   console.log('Server runing on port 3000');
});