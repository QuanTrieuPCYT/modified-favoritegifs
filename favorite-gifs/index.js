(function(s,a,o,r,d,l,g,m){"use strict";function p(e,t){const n=Math.max(...Object.values(e).map(function(i){return i.order}));return{format:t.format,src:t.url,width:t.width,height:t.height,order:n+1}}function y(e){for(let t of e.embeds){if(t.type==="gifv")return{url:t.url,width:t.thumbnail.width,height:t.thumbnail.height,format:2};if(t.type==="image"&&t.url.endsWith(".gif"))return{url:t.url,width:t.image.width,height:t.image.height,format:1}}for(let t of e.attachments)if(t.url.endsWith(".gif"))return{url:t.url,width:t.width,height:t.height,format:1};return null}function w(e){const t=Object.getOwnPropertyNames(e.__proto__).concat(Object.getOwnPropertyNames(Object.getPrototypeOf(e))).filter(function(n){return typeof e[n]=="function"});g.logger.log(t)}const{FormRow:v,FormIcon:b}=d.Forms,c=o.findByProps("openLazy","hideActionSheet"),F=o.findByStoreName("UserSettingsProtoStore").frecencyWithoutFetchingLatest,P=a.before("openLazy",c,function(e){const[t,n,i]=e;n==="MessageLongPressActionSheet"&&t.then(function(O){const S=a.after("default",O,function(I,_){r.React.useEffect(function(){return function(){S()}},[]);let[B,f]=_.props?.children?.props?.children?.props?.children;const u=B?.props?.message??i?.message;if(!f||!u)return;const h=y(u);h&&f.unshift(r.React.createElement(v,{label:"Add GIF to Favorites",leading:r.React.createElement(b,{style:{opacity:1},source:l.getAssetIDByName("ic_star_filled")}),onPress:function(){c.hideActionSheet();const G=o.findByProps("updateAsync");w(G),p(F.favoriteGifs.gifs,h),m.showToast("Added GIF to Favorites")}}))})})}),A=function(){return P()};return s.onUnload=A,s})({},vendetta.patcher,vendetta.metro,vendetta.metro.common,vendetta.ui.components,vendetta.ui.assets,vendetta,vendetta.ui.toasts);
