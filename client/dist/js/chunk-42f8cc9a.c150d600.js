(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-42f8cc9a"],{"51d9":function(t,e,o){"use strict";o.r(e);var n=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[o("div",{staticClass:"account-pages my-5 pt-5"},[o("div",{staticClass:"container"},[o("div",{staticClass:"row justify-content-center align-items-center"},[o("div",{staticClass:"col-md-6 col-lg-6 col-xl-6"},[o("div",{staticClass:"card overflow-hidden"},[t._m(0),o("div",{staticClass:"card-body pt-4"},[t.onlobby?o("tokenForm",{ref:"tokenForm"}):o("JoinForm",{ref:"joinForm"})],1)])])])])])])},i=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"d-flex justify-content-center p-4 bg-black  align-items-center"},[n("img",{staticClass:"center",attrs:{src:o("acee"),alt:""}})])}],a=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[o("div",{staticClass:"d-flex flex-column p-2 justify-content-center align-items-center"},[o("h4",{staticClass:"text-dark font-size-18"},[t._v("Room ID : "+t._s(t.room))]),o("p",[t._v("Set your name for participation, and choose how you want to join:")])]),t.akses&&t.canversi?o("div",{staticClass:"form p-2"},[o("div",{staticClass:"form-group"},[o("label",{staticClass:"control-label"},[t._v("Room ID : ")]),o("input",{directives:[{name:"model",rawName:"v-model",value:t.room,expression:"room"}],staticClass:"form-control",attrs:{type:"text",placeholder:t.room},domProps:{value:t.room},on:{input:function(e){e.target.composing||(t.room=e.target.value)}}})]),o("div",{staticClass:"form-group"},[o("label",{staticClass:"control-label"},[t._v("Your Name : ")]),o("input",{directives:[{name:"model",rawName:"v-model",value:t.username,expression:"username"}],staticClass:"form-control",attrs:{type:"text",placeholder:"guest"},domProps:{value:t.username},on:{input:function(e){e.target.composing||(t.username=e.target.value)}}})]),o("div",{staticClass:"form-group float-right"},[t.loading?t._e():o("button",{staticClass:"btn btn-success btn-lg",on:{click:function(e){return t.join()}}},[t.loading?o("span",[t._v("loading")]):o("span",[t._v("Start")])])])]):o("div",{staticClass:"form p-2"},[o("p",[t._v("Please Use Chrome Latest Version ")]),o("p",[t._v("Your Browser : "+t._s(t.browser))]),o("p",[t._v("Version : "+t._s(t.versi))])])])},s=[],l=(o("a15b"),o("b0c0"),o("7270")),r={data:function(){return{room:"123456789",username:"Guest",loading:!1,i:0}},computed:{akses:function(){return this.$browserDetect.isChrome},canversi:function(){return this.$browserDetect.meta.version>=84},browser:function(){return this.$browserDetect.meta.name},versi:function(){return this.$browserDetect.meta.version}},methods:{join:function(){0==this.i&&(this.loading=!0,l["a"].join({room:this.room,username:this.username})),this.i++}}},c=r,m=o("2877"),d=Object(m["a"])(c,a,s,!1,null,null,null),u=d.exports,v=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[o("div",{staticClass:"d-flex flex-column p-2 justify-content-center align-items-center"},[o("h4",{staticClass:"text-dark font-size-18"},[t._v("Room ID : "+t._s(t.room))]),o("h3",{staticClass:"mt-2"},[t._v("Waiting approval")]),o("p",{staticClass:"mt-1"},[t._v("Please wait, the meeting host will let you in soon.")])]),o("div",{staticClass:"form p-2"},[o("button",{staticClass:"btn btn-light btn-lg btn-block",on:{click:function(e){return t.showModal()}}},[t._v(" HAVE A HOST TOKEN ? ")])]),o("b-modal",{ref:"modal-token",attrs:{id:"modal-token",centered:"","no-close-on-backdrop":"","no-close-on-esc":"",title:"Host Token","hide-header":!0,"hide-footer":!1,size:"md","hide-header-close":!0}},[o("div",{staticClass:"p-3"},[o("p",[t._v("The host token is generated by the admin who made this room meeting. if you join the token room from the admin, then you will automatically be hosted in this room meeting.")]),o("div",{staticClass:"form-group"},[o("label",{staticClass:"control-label"},[t._v("Host Token")]),o("input",{directives:[{name:"model",rawName:"v-model",value:t.token,expression:"token"}],staticClass:"form-control",attrs:{type:"text"},domProps:{value:t.token},on:{input:function(e){e.target.composing||(t.token=e.target.value)}}})]),o("b-button",{on:{click:function(e){return t.hideModal()}}},[t._v("Close")]),o("b-button",{on:{click:function(e){return t.Validate()}}},[t._v("Validate")])],1)])],1)},p=[],h={validate:function(){return!0}},g={data:function(){return{token:"",room:"123456789"}},methods:{showModal:function(){this.$bvModal.show("modal-token")},hideModal:function(){this.$bvModal.hide("modal-token")},Validate:function(){var t=h.validate();t?l["a"].iamHost():alert("salah token lu")}}},b=g,A=Object(m["a"])(b,v,p,!1,null,null,null),C=A.exports,w={page:{title:"Join Meeting Video"},components:{JoinForm:u,tokenForm:C},data:function(){return{title:"Home",mode:""}},computed:{onlobby:function(){return this.$store.getters["lobby/iamOnLobby"]}}},f=w,k=Object(m["a"])(f,n,i,!1,null,null,null);e["default"]=k.exports},acee:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAREAAAAmCAYAAADjnK8vAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVDRDRGMUNBOTQ0NjExRUFCMTU2QjJEMTRGRjFDOUY1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVDRDRGMUNCOTQ0NjExRUFCMTU2QjJEMTRGRjFDOUY1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NUNENEYxQzg5NDQ2MTFFQUIxNTZCMkQxNEZGMUM5RjUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NUNENEYxQzk5NDQ2MTFFQUIxNTZCMkQxNEZGMUM5RjUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6z43kEAAAMNElEQVR42uxd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"}}]);
//# sourceMappingURL=chunk-42f8cc9a.c150d600.js.map