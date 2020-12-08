/**
 * @author      Created by Dmitrijs Osipovs <dmitrijsosipov@gmail.com> on 07.12.2020.
 * @link        https://github.com/docodern
 * @license     http://opensource.org/licenses/MIT
 */

'use strict'

const fs = require("fs")


const con = {};
var parame = {};
var lang;
var checker = arr => arr.every(Boolean);
function parseLang(file) {
    lang = JSON.parse(fs.readFileSync(con.langDir + '/' + file + '.json'));
    return lang
};


    function config (val){
    con.languages = typeof val.languages === 'object' ? val.languages : ['en'];
    con.defaultLang = typeof val.defaultLang === 'string' ? val.defaultLang : 'en';
    con.langDir = typeof val.langDir === 'string' ? val.langDir : 'languages';
    con.origin = typeof val.origin === 'string' ? val.origin : 'http://localhost:3000';
    con.cookieName = typeof val.cookieName === 'string' ? val.cookieName : 'lang';
    con.langParam = typeof val.langParam === 'string' ? val.langParam : 'lang';
};

    function run (req, res, val){

    let useParams = typeof val.useParams === 'object' ? val.useParams : [con.langParam];
    let page = typeof val.page === 'string' ? val.page : 'index';
    let page404 = typeof val.page404 === 'string' ? val.page404 : undefined;

    let cookieLang = req.cookies[con.cookieName];
    let p;
    let ifTrue = [];
    let checkParam;
    let par = req.params[con.langParam];

    if (par != undefined) {
        checkParam = con.languages.indexOf(par);
        parseLang(par);
        for (p = 0; p < useParams.length; p++) {
            if (req.params[useParams[p]] === lang.smws[useParams[p]]) {
                ifTrue.push(true);
                parame[useParams[p]] = req.params[useParams[p]];
            } else {
                ifTrue.push(false);
            }
        };
    } else {
        checkParam = -1;
    }


    if (checker(ifTrue) === true) {
        if (checkParam > -1) {
            res.setHeader('Set-Cookie', con.cookieName+'=' + par + '; Max-Age=86400; HttpOnly, Secure; path=/');
            res.render(page, parseLang(par));
        } else if (!cookieLang) {
            res.setHeader('Set-Cookie', con.cookieName+'=' + con.defaultLang + '; Max-Age=86400; HttpOnly, Secure; path=/');
            res.render(page, parseLang(con.defaultLang));
        } else {
            res.render(page, parseLang(cookieLang));
        };
    } else {
        page404 === undefined ? res.status(404).send('Page not found!') : res.status(404).render(page404, parseLang(par));
    }
};

    function switcher (req, res){

    let setLng = req.body.lang;
    let path = req.headers.referer;
    let newUrl = path.slice(con.origin);
    let parKey = Object.keys(parame);
    let parValues = Object.values(parame);
    let ifTrue = [];

    for (var d = 0; d < parValues.length; d++) {
        if (newUrl.includes('/' + parValues[d]) === true) {
            ifTrue.push(true);
        } else {
            ifTrue.push(false);
        }
    };

    if (checker(ifTrue) === true && ifTrue.length != 0) {
        for (var b = 0; b < parValues.length; b++) {
            parseLang(setLng)
            newUrl = newUrl.replace('/' + parValues[b], '/' + lang.smws[parKey[b]]);
        };
        res.redirect(newUrl);
    } else {
        res.redirect('/' + setLng);
    }
    parame = {}
};

    function split (urli){

    let newUrl = urli;
    let j;
    let i;
    let langPath;
    let getSets;
    let keys = [];
    let match = [];
    let matches = [];
    let subMatches;
    let chng;

    for (j = 0; j < con.languages.length; j++) {

        parseLang(con.languages[j]);

        getSets = newUrl.split('/');

        if (j === 0) {

            getSets.forEach(e => {
                if (e.startsWith(':') === true) {
                    matches.push(e);
                }
            });

            langPath = lang.smws;
            keys = Object.keys(langPath);
            keys.forEach((key, k) => keys[k] = ':' + key);

            for (i = 0; i < matches.length; i++) {

                if (keys.includes(matches[i]) === true) {
                    matches[i] = matches[i].slice(1);
                    chng = matches[i].substring(0, matches[i].indexOf('((') === -1 ? matches[i].length : matches[i].indexOf('(('));
                    match.push(matches[i] + '((?:' + lang.smws[chng] + '))');
                };

                if (chng != '') {
                    newUrl = newUrl.replace(matches[i], matches[i] + '((?:' + lang.smws[chng] + '))');
                } else {
                    newUrl = newUrl;
                }

                chng = '';
            }
            matches = match;
        } else {

            keys = match;
            match = [];

            for (i = 0; i < matches.length; i++) {

                if (keys.includes(matches[i]) === true) {

                    chng = matches[i].substring(0, matches[i].indexOf('((') === -1 ? matches[i].length : matches[i].indexOf('(('));
                }

                if (chng != '') {

                    subMatches = matches[i].substring(0, matches[i].indexOf('))') === -1 ? matches[i].length : matches[i].indexOf('))'));
                    newUrl = newUrl.replace(matches[i], subMatches + '|' + lang.smws[chng] + '))');
                    match.push(subMatches + '|' + lang.smws[chng] + '))');
                } else {
                    newUrl = newUrl;
                }

                chng = '';
            }
            matches = match;
        }
    }
    return newUrl;
};

module.exports = {
    config,
    run,
    switcher,
    split
}