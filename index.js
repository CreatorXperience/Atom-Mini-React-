
function createElement(type, props, ...children){
return {
    type,
    props: {
      ...props,
      children:  children.map((child)=> {
     return  typeof child === "object" ? child : createTextElement(child)
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


function render(element, container){
  // renders to the DOM 
  console.log(element)
 let domElmnt =  element.type == "TEXT_ELEMENT" ? document.createTextNode(element.type) :  document.createElement(element.type)
  element.props.children.forEach((childElmnt)=> {
    render(childElmnt, domElmnt)
  })
  container.appendChild(domElmnt)
  
  const isProperty = key => key !== "children"

  Object.keys(element.props).filter(isProperty).forEach((key)=> {
    domElmnt[key] = element.props[key]
  })
}

const Atom =  { createElement, render } 
const root  =  document.getElementById("root")
Atom.render(Atom.createElement("div",  { id: "container" } , Atom.createElement("p" , {className: "para1" }   , "Hello world")), root )
