(function(f,u,i,o,g,v,c){"use strict";function p(t,e){const s=Math.max(...Object.values(t).map(function(a){return a.order}));return{format:e.format,src:e.src,url:e.url,width:e.width,height:e.height,order:s+1}}function F(t){for(let e of t.embeds){if(e.type==="gifv")return{src:e.video.url,url:e.url,width:e.thumbnail.width,height:e.thumbnail.height,format:2};if(e.type==="image"&&e.url.endsWith(".gif"))return{src:e.image.url,url:e.url,width:e.image.width,height:e.image.height,format:1}}for(let e of t.attachments)if(e.url.endsWith(".gif"))return{src:e.url,url:e.url,width:e.width,height:e.height,format:1};return null}const{FormRow:w,FormIcon:y}=g.Forms,d=i.findByProps("openLazy","hideActionSheet"),{addFavoriteGIF:G,removeFavoriteGIF:b}=i.findByProps("addFavoriteGIF","removeFavoriteGIF"),n=i.findByStoreName("UserSettingsProtoStore").frecencyWithoutFetchingLatest,R=u.before("openLazy",d,function(t){const[e,s,a]=t;s==="MessageLongPressActionSheet"&&e.then(function(I){const P=u.after("default",I,function(L,S){o.React.useEffect(function(){return function(){P()}},[]);let[B,h]=S.props?.children?.props?.children?.props?.children;const l=B?.props?.message??a?.message;if(!h||!l)return;const r=F(l);if(!r)return;const m=n.favoriteGifs.gifs[r.src]!==void 0||n.favoriteGifs.gifs[r.url]!==void 0;h.unshift(o.React.createElement(w,{label:m?"Remove from Favorites":"Add to Favorites",leading:o.React.createElement(y,{style:{opacity:1},source:v.getAssetIDByName("ic_star_filled")}),onPress:function(){d.hideActionSheet(),m?(b(r.url),c.showToast("Removed from Favorites",855)):(G(p(n.favoriteGifs.gifs,r)),c.showToast("Added to Favorites",855))}}))})})}),A=function(){return R()};return f.onUnload=A,f})({},vendetta.patcher,vendetta.metro,vendetta.metro.common,vendetta.ui.components,vendetta.ui.assets,vendetta.ui.toasts);
