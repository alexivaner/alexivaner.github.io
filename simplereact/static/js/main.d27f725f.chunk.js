(this["webpackJsonpreact-tutorial"]=this["webpackJsonpreact-tutorial"]||[]).push([[0],{15:function(t,e,a){},16:function(t,e,a){"use strict";a.r(e);var r=a(1),c=a(7),n=a.n(c),i=a(9),s=a(2),h=a(3),j=a(5),o=a(4),b=a(0),l=function(){return Object(b.jsx)("thead",{children:Object(b.jsxs)("tr",{children:[Object(b.jsx)("th",{children:"Name"}),Object(b.jsx)("th",{children:"Job"})]})})},u=function(t){var e=t.characterData.map((function(e,a){return Object(b.jsxs)("tr",{children:[Object(b.jsx)("td",{children:e.name}),Object(b.jsx)("td",{children:e.job}),Object(b.jsx)("td",{children:Object(b.jsx)("button",{onClick:function(){return t.removeCharacter(a)},children:"Delete"})})]},a)}));return Object(b.jsx)("tbody",{children:e})},d=function(t){var e=t.characterData,a=t.removeCharacter;return Object(b.jsxs)("table",{children:[Object(b.jsx)(l,{}),Object(b.jsx)(u,{characterData:e,removeCharacter:a})]})},m=a(8),O=function(t){Object(j.a)(a,t);var e=Object(o.a)(a);function a(){var t;Object(s.a)(this,a);for(var r=arguments.length,c=new Array(r),n=0;n<r;n++)c[n]=arguments[n];return(t=e.call.apply(e,[this].concat(c))).handleChange=function(e){var a=e.target,r=a.name,c=a.value;t.setState(Object(m.a)({},r,c))},t.initialState={name:"",job:""},t.submitForm=function(){t.props.handleSubmit(t.state),t.setState(t.initialState)},t.state=t.initialState,t}return Object(h.a)(a,[{key:"render",value:function(){var t=this.state,e=t.name,a=t.job;return Object(b.jsxs)("form",{children:[Object(b.jsx)("label",{htmlFor:"name",children:"Name"}),Object(b.jsx)("input",{type:"text",name:"name",id:"name",value:e,onChange:this.handleChange}),Object(b.jsx)("label",{htmlFor:"job",children:"Job"}),Object(b.jsx)("input",{type:"text",name:"job",id:"job",value:a,onChange:this.handleChange}),Object(b.jsx)("input",{type:"button",value:"Submit",onClick:this.submitForm})]})}}]),a}(r.Component),x=O,v=function(t){Object(j.a)(a,t);var e=Object(o.a)(a);function a(){var t;Object(s.a)(this,a);for(var r=arguments.length,c=new Array(r),n=0;n<r;n++)c[n]=arguments[n];return(t=e.call.apply(e,[this].concat(c))).state={characters:[]},t.removeCharacter=function(e){var a=t.state.characters;t.setState({characters:a.filter((function(t,a){return a!==e}))})},t.handleSubmit=function(e){t.setState({characters:[].concat(Object(i.a)(t.state.characters),[e])})},t}return Object(h.a)(a,[{key:"render",value:function(){var t=this.state.characters;return Object(b.jsxs)("div",{className:"container",children:[Object(b.jsx)("h1",{children:"React Tutorial"}),Object(b.jsxs)("p",{children:["Source ",Object(b.jsx)("a",{href:"https://www.taniarascia.com/getting-started-with-react/",children:"click here"})]}),Object(b.jsx)(d,{characterData:t,removeCharacter:this.removeCharacter}),Object(b.jsx)(x,{handleSubmit:this.handleSubmit})]})}}]),a}(r.Component),f=v;a(15);n.a.render(Object(b.jsx)(f,{}),document.getElementById("root"))}},[[16,1,2]]]);
//# sourceMappingURL=main.d27f725f.chunk.js.map