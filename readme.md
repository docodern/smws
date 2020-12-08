# smws
## Simple multilingual website module

This is lightweight module, which help to render and controle you pages and paths.

Work with *Express.js*, tested with EJS and Eta view engines.

You can create multilingual website with SEO friendly urls.

To see and test example pls visit [test on Github](https://github.com/docodern/smws)

### Installation

```
$ npm i smws
```
### Features

 * Check language from params or cookies,
 * Render view engine template with options from language file,
 * Not needed to setup `app.get` for each language,
 * SEO friendly urls;

### Functions
`smws.switcher(req,res);` - use to switch languages from client-side;

`smws.run(req,res,val);` - use to render template and contole params;

`smws.split(path);` - use to make multilangual url ;

### Setup example

**Setup you app file**

For example:
 ```javascript
 const express = require('express'),
       cookieParser = require('cookie-parser'), // needed cookie-parser
       bodyParser = require('body-parser'), // needed body-parser
       smws = require('smws'), // require smws
       app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());


app.listen(process.env.PORT || 3000, () => {
    console.log('Server runing on port 3000');
});
```

**Configure module:**

Use `smws.config({options});` to setup module defaults;

*This function is mandatory to setup*
```javascript
smws.config({
    defaultLang: 'de',
    languages: ['en','de','ru'],
    origin: 'https://yourdomain.com'
});
```

> **Config options:**
>
> - `languages` Are your website languages, write in *array*. By default `['en']`,
> - `defaultLang` Is prefered default language which will be rendered when someone first time visit youre homepage. By default `'en'`,
> - `langDir` Is directory name in root where you store youre *.json* files with traslations. By default `'languages'`,
> - `origin` Is youre website origin. By default `'http://localhost:3000'`,
> - `cookieName` Is cookie name which will be used to set language. By default `'lang'`,
> - `langParam` Is path param for languages. By default `'lang'`;
>

**Write your GET requests**

When you write your paths use `smws.split('path')` to *GET* SEO friendly urls with params in all languages.

For example:
```javascript
app.get(smws.split('/:lang/:category/'), (req,res)=>{
    /////////////////////
});
```

**Response templates and controle urls**

Use `smws.run({options});` to render template and controle your params:

```javascript
app.get(smws.split('/:lang/:category/'), (req,res)=>{
    smws.run(req,res,{
        page: 'index',
        useParams: ['lang', 'category'],
        page404: 'page404'
    });
});
```

> **Run options:**
>
> - `page` Template in views which will be used for response. By default `index`;
> - `useParams` *Array* of params which need to controle, example:
>
> You have this path `/:lang/:category/:userID`, and you want to controle translation only for `:lang` and `:category` params.
>
> You have language *.json* files *ru.json* and *en.json*.
>
> In language files you add translation for this params *(more about language files below)*.
>
> for *en.json* `lang: 'en', category: 'category'` and *ru.json* `lang: 'ru', category: 'kategoriya'`,
>
> then function allows to open paths like `/en/category/:userID` or `/ru/kategoriya/:userID`,
>
> But sends 404 page when path will be `/en/categoriya/:userID` or `/ru/category/:userID`;
> - `page404` Template for 404 page. If not added then will response `Page not found`;

**Setup language files**

Default dir `languages`, you can change it in `smws.config({options});`.

Use file names same with you are defined in `smws.config({languages: ['en','ru']});`.

Language file example:
```json
// en.json
{
    "smws": {
            "category": "category",
            "lang": "en"
    },
    "hello": "Hello world"
}
```

**Language switcher**

You will need to setup backend and front-end to change prefered language!

In backend use `smws.switcher(req,res);`:

```javascript
// example:
app.post('/:lang/languages',(res,req)=>{
    smws.switcher(req,res);
});
```

In front-end:

```html:5
<!-- using Eta engine -->
<form action="/<%= it.smws.lang %>/language" method="post">
    <button class="en-button" type="submit" name="lang" value="en">EN</button>
    <button class="ru-button" type="submit" name="lang" value="ru">RU</button>
</form>

<!-- using ejs engine -->
<form action="/<%= smws.lang %>/language" method="post">
    <button class="en-button" type="submit" name="lang" value="en">EN</button>
    <button class="ru-button" type="submit" name="lang" value="ru">RU</button>
</form>
```
<div align="center">

Thank you for attention!

Hope this module will be helpfull for someone!

If you like it and want to say thx

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/G2G22W4OM)

</div>
