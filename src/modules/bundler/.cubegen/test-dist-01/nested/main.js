!function(e,n,o,r,t){var u="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},f="function"==typeof u[r]&&u[r],i=f.cache||{},l="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function c(n,o){if(!i[n]){if(!e[n]){var t="function"==typeof u[r]&&u[r];if(!o&&t)return t(n,!0);if(f)return f(n,!0);if(l&&"string"==typeof n)return l(n);var d=Error("Cannot find module '"+n+"'");throw d.code="MODULE_NOT_FOUND",d}s.resolve=function(o){var r=e[n][1][o];return null!=r?r:o},s.cache={};var a=i[n]=new c.Module(n);e[n][0].call(a.exports,s,a,a.exports,this)}return i[n].exports;function s(e){var n=s.resolve(e);return!1===n?{}:c(n)}}c.isParcelRequire=!0,c.Module=function(e){this.id=e,this.bundle=c,this.exports={}},c.modules=e,c.cache=i,c.parent=f,c.register=function(n,o){e[n]=[function(e,n){n.exports=o},{}]},Object.defineProperty(c,"root",{get:function(){return u[r]}}),u[r]=c;for(var d=0;d<n.length;d++)c(n[d]);if(o){var a=c(o);"object"==typeof exports&&"undefined"!=typeof module?module.exports=a:"function"==typeof define&&define.amd&&define(function(){return a})}}({jHmjN:[function(e,n,o){(0,e("../child").sayHello)()},{"../child":"3KZbp"}],"3KZbp":[function(e,n,o){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(o),r.export(o,"sayHello",function(){return t});var t=function(){console.log("Hello Word!")}},{"@parcel/transformer-js/src/esmodule-helpers.js":"kPSB8"}],kPSB8:[function(e,n,o){o.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},o.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},o.exportAll=function(e,n){return Object.keys(e).forEach(function(o){"default"===o||"__esModule"===o||Object.prototype.hasOwnProperty.call(n,o)||Object.defineProperty(n,o,{enumerable:!0,get:function(){return e[o]}})}),n},o.export=function(e,n,o){Object.defineProperty(e,n,{enumerable:!0,get:o})}},{}]},["jHmjN"],"jHmjN","parcelRequire39fa");