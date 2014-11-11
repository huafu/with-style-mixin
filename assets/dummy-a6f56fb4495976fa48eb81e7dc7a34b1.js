define("dummy/app",["ember","ember/resolver","ember/load-initializers","dummy/config/environment","exports"],function(e,t,n,l,i){"use strict";var r=e["default"],a=t["default"],s=n["default"],o=l["default"];r.MODEL_FACTORY_INJECTIONS=!0;var u=r.Application.extend({modulePrefix:o.modulePrefix,podModulePrefix:o.podModulePrefix,Resolver:a});s(u,o.modulePrefix),i["default"]=u}),define("dummy/controllers/application",["ember","exports"],function(e,t){"use strict";var n=e["default"];t["default"]=n.Controller.extend({width:10,height:20,margin:"10px",marginTop:"1",isShown:!0,isLarge:!1})}),define("dummy/helpers/bind-style",["ember","with-style-mixin/core/style-bindings-meta","exports"],function(e,t,n){"use strict";function l(e){return e=null===e||void 0===e?"":""+e,e.replace(/[&<>'"]/g,function(e){return o[e]})}function i(){var e=[].slice.call(arguments),t=e.pop(),n=t.data.view,i=new a(this,e),o=++s;return i.addListener(function(){var e;!n||n.isDestroying||n.isDestroyed||!(e=n.$("[data-bindstyle-"+o+'="'+o+'"]')).length?(i.destroy(),i=null):e.attr("style",i.getStyle())}),r.addListener(n,"willClearRender",i,"destroy"),r.addListener(n,"willDestroyElement",i,"destroy"),r.run.once(i,"startObserving"),new r.Handlebars.SafeString('style="'+l(i.getStyle())+'" data-bindstyle-'+o+'="'+o+'"')}var r=e["default"],a=t["default"],s=0,o={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};n.bindStyle=i,n["default"]=i}),define("dummy/router",["ember","dummy/config/environment","exports"],function(e,t,n){"use strict";var l=e["default"],i=t["default"],r=l.Router.extend({location:i.locationType});r.map(function(){}),n["default"]=r}),define("dummy/routes/application",["ember","exports"],function(e,t){"use strict";var n=e["default"];t["default"]=n.Route.extend({setupController:function(e){e.setProperties({borderWidth:2,borderStyle:"dashed",fontPercent:100,appPaddingTop:20})}})}),define("dummy/templates/application",["ember","exports"],function(e,t){"use strict";var n=e["default"];t["default"]=n.Handlebars.template(function(e,t,l,i,r){this.compilerInfo=[4,">= 1.0.0"],l=this.merge(l,n.Handlebars.helpers),r=r||{};var a,s,o="",u=l.helperMissing,d=this.escapeExpression;return r.buffer.push('<div class="social-networks-bar">\n  <iframe\n      src="http://ghbtns.com/github-btn.html?user=huafu&repo=with-style-mixin&type=watch&count=true"\n      allowtransparency="true" frameborder="0" scrolling="0" width="80" height="20"></iframe>\n  <iframe\n      src="//platform.twitter.com/widgets/follow_button.html?screen_name=HuafuGandon"\n      style="width: 240px; height: 20px;"\n      allowtransparency="true"\n      frameborder="0"\n      scrolling="no">\n  </iframe>\n</div>\n\n<h1>with-style-mixin</h1>\n\n<section '),r.buffer.push(d((a=l["bind-style"]||t&&t["bind-style"],s={hash:{},hashTypes:{},hashContexts:{},contexts:[t,t,t],types:["STRING","STRING","STRING"],data:r},a?a.call(t,"border-width[px] border-style","asInlineBlock:display?inline-block:","fontPercent:font-size[%]",s):u.call(t,"bind-style","border-width[px] border-style","asInlineBlock:display?inline-block:","fontPercent:font-size[%]",s)))),r.buffer.push(">\n  <pre>\n    <code lang=\"handlebars\">\n      &lt;section {{bind-style 'border-width[px] border-style'\n        'asInlineBlock:display?inline-block:' 'fontPercent:font-size[%]'}}&gt;...&lt;/section&gt;\n    </code>\n  </pre>\n  <div>\n    <label>borderWidth = "),r.buffer.push(d((a=l.input||t&&t.input,s={hash:{value:"borderWidth"},hashTypes:{value:"ID"},hashContexts:{value:t},contexts:[],types:[],data:r},a?a.call(t,s):u.call(t,"input",s)))),r.buffer.push("</label>\n    <label>borderStyle = "),r.buffer.push(d((a=l.input||t&&t.input,s={hash:{value:"borderStyle"},hashTypes:{value:"ID"},hashContexts:{value:t},contexts:[],types:[],data:r},a?a.call(t,s):u.call(t,"input",s)))),r.buffer.push("</label>\n    <label>fontPercent = "),r.buffer.push(d((a=l.input||t&&t.input,s={hash:{value:"fontPercent"},hashTypes:{value:"ID"},hashContexts:{value:t},contexts:[],types:[],data:r},a?a.call(t,s):u.call(t,"input",s)))),r.buffer.push("</label>\n    <label>asInlineBlock = "),r.buffer.push(d((a=l.input||t&&t.input,s={hash:{type:"checkbox",checked:"asInlineBlock"},hashTypes:{type:"STRING",checked:"ID"},hashContexts:{type:t,checked:t},contexts:[],types:[],data:r},a?a.call(t,s):u.call(t,"input",s)))),r.buffer.push("</label>\n  </div>\n</section>\n\n<section>\n  <pre>\n    <code lang=\"javascript\">\nimport Ember from 'ember';\nimport WithStyleMixin from 'with-style-mixin/mixins/with-style';\n\nexport default Ember.View.extend(WithStyleMixin, {\n  styleBindings: [\n    'controller.appPaddingTop:padding-top[px]',\n    'bgColor:background-color'\n  ],\n\n  bgColor: 'inherit',\n\n  // ...\n});\n    </code>\n  </pre>\n  <label>appPaddingTop = "),r.buffer.push(d((a=l.input||t&&t.input,s={hash:{value:"appPaddingTop"},hashTypes:{value:"ID"},hashContexts:{value:t},contexts:[],types:[],data:r},a?a.call(t,s):u.call(t,"input",s)))),r.buffer.push("</label>\n  <label>view.bgColor = "),r.buffer.push(d((a=l.input||t&&t.input,s={hash:{value:"view.bgColor"},hashTypes:{value:"ID"},hashContexts:{value:t},contexts:[],types:[],data:r},a?a.call(t,s):u.call(t,"input",s)))),r.buffer.push("</label>\n</section>\n"),o})}),define("dummy/views/application",["ember","with-style-mixin/mixins/with-style","exports"],function(e,t,n){"use strict";var l=e["default"],i=t["default"];n["default"]=l.View.extend(i,{styleBindings:["controller.appPaddingTop:padding-top[px]","bgColor:background-color"],bgColor:"inherit",initHljs:function(){l.run.schedule("afterRender",this,function(){this.$("pre code").each(function(e,t){hljs.highlightBlock(t)})})}.on("didInsertElement")})}),define("dummy/config/environment",["ember"],function(e){var t="dummy/config/environment",n=e["default"].$('meta[name="'+t+'"]').attr("content"),l=JSON.parse(unescape(n));return{"default":l}}),runningTests?require("dummy/tests/test-helper"):require("dummy/app")["default"].create({});