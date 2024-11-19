
function createElement(type, props, ...children){
return {
    type,
    props: {
      ...props,
      children:  children.map((child)=> {
      typeof child === "object" ? child : createTextElement()
      })
    },
  } 
}



function createTextElement(text){
return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  }
}


const Atom =  { createElement:  createElement("div", { id:  "container" },  createElement("p",  {className:  "paragraph" } )) } 
console.log(createElement("h1", null,  "peter"))
