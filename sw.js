if(!self.define){let e,i={};const r=(r,c)=>(r=new URL(r+".js",c).href,i[r]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=r,e.onload=i,document.head.appendChild(e)}else e=r,importScripts(r),i()})).then((()=>{let e=i[r];if(!e)throw new Error(`Module ${r} didn’t register its module`);return e})));self.define=(c,s)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(i[a])return;let n={};const f=e=>r(e,a),d={module:{uri:a},exports:n,require:f};i[a]=Promise.all(c.map((e=>d[e]||f(e)))).then((e=>(s(...e),n)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"all-court.jpg",revision:"d72a484e9858d487030ade5c847c6081"},{url:"apple-touch-icon-180x180.png",revision:"a5d14a623fe98b379c783a79cb8444f9"},{url:"assets/index-Bsa7WD-W.css",revision:null},{url:"assets/index-C_o_lFy9.js",revision:null},{url:"basketball.svg",revision:"5f8a32b9951a5c11673b99c6d06a8f1b"},{url:"blue1.svg",revision:"9abba4c3600267c4fc5b898fca36dcd0"},{url:"blue2.svg",revision:"6ac8efb260e85be11517e4d132da1de9"},{url:"blue3.svg",revision:"19c3c543fa1f8352daa964d4036695b0"},{url:"blue4.svg",revision:"68672aae380e9074a72eed401ec99db2"},{url:"blue5.svg",revision:"727b03151221b329e442d041bee383ac"},{url:"favicon.ico",revision:"5b1fc36d471ef9d70ce8cf18acf977fe"},{url:"half-court.png",revision:"74b1f7aceb3d046d8a88805e0cd72f2e"},{url:"index.html",revision:"403d120845946224705bc17e67a3986c"},{url:"logo.png",revision:"8a67114e3a3837ec9e1ff31114ae0bfc"},{url:"manifest.webmanifest",revision:"84a54ceec5d191e2585c7e3f8ed3de12"},{url:"maskable-icon-512x512.png",revision:"b447fefcca6b3cb7560f591f25a8899a"},{url:"pwa-192x192.png",revision:"813df1e622a4af75cb5b12ff259333b9"},{url:"pwa-512x512.png",revision:"0300eb25cc52096e40569fa94549c357"},{url:"pwa-64x64.png",revision:"9cc3b59295a876740e05d6725f2e7c00"},{url:"red1.svg",revision:"55da40ab0e211b6b7c9dab62682530b3"},{url:"red2.svg",revision:"17fc64bca6e309acc2935162fe29af95"},{url:"red3.svg",revision:"48cd7bbc777c74e84d4d5e3f5978ca29"},{url:"red4.svg",revision:"d88e1a4740d770ad372cd8c0d1cf4b6e"},{url:"red5.svg",revision:"7d614449f8c6beb9f8f75ba3fd99940a"},{url:"registerSW.js",revision:"6fae201a5c9a4b3829a0df5e7f57ebbd"},{url:"pwa-192x192.png",revision:"813df1e622a4af75cb5b12ff259333b9"},{url:"pwa-512x512.png",revision:"0300eb25cc52096e40569fa94549c357"},{url:"pwa-64x64.png",revision:"9cc3b59295a876740e05d6725f2e7c00"},{url:"manifest.webmanifest",revision:"84a54ceec5d191e2585c7e3f8ed3de12"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
