
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

let  nextUnitOfWork = null

function render(element, container){
  // renders to the DOM 
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  }
}

function workloop(deadline){
nextUnitOfWork  = performUnitOfWork(nextUnitOfWork)
}


function performUnitOfWork(fiber){
  if(!fiber.dom){
    fiber.dom  =  createDom(fiber)
  }
  if(fiber.parent){
    fiber.parent.appendChild(fiber.dom)
  }

  let elements = fiber.props.children
  let prevSibling = null
  let index = 0 
  
  while(index <  elements.length){
    let element = elements[index]
    let newFiber = {
      dom: null,
      parent: fiber,
      props: element.props,
      type: element.type
    }
    
    if(index == 0){
      fiber.child = newFiber
    }else{
      prevSibling.sibling =  newFiber
    }

    prevSibling = newFiber
    index++
  }

if(fiber.child){
    return fiber.child
  }
  let nextFiber = fiber
  while(nextFiber){
    if(nextFiber.sibling){
      return nextFiber.sibling
    }

    nextFiber = nextFiber.parent

  }

}


function createDom(fiber){
 let domElmnt =  fiber.type == "TEXT_ELEMENT" ? document.createTextNode(fiber.type) :  document.createElement(fiber.type)

  const isProperty = key => key !== "children"

  Object.keys(element.props).filter(isProperty).forEach((key)=> {
    domElmnt[key] = element.props[key]
  })

  return  domElmnt
}

const Atom =  { createElement, render } 
const root  =  document.getElementById("root")
Atom.render(Atom.createElement("div",  { id: "container" } , Atom.createElement("p" , {className: "para1" }   , "Hello world")), root )
