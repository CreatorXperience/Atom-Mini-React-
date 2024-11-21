
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
let  wipRoot  = null
let oldRoot  = null
let deletions = null

function render(element, container){
  // renders to the DOM 
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
    alternate: oldRoot
  }

  deletions = []
  wipRoot = nextUnitOfWork
}


function workloop(deadline){
  let shouldYield = false
  while(nextUnitOfWork && !shouldYield){
    nextUnitOfWork  = performUnitOfWork(nextUnitOfWork)
   shouldYield = deadline.timeRemaining < 1
  }

  if (!nextUnitOfWork && wipRoot){
  commitRoot()
  }
}

function commitRoot(){
deletions.forEach(commitWork)
commitWork(wipRoot.child)
oldRoot = wipRoot
wipRoot = null 
}

function commitWork(fiber){
if (!fiber){
    return
  }

let  domParent = fiber.parent.dom

if(fiber.effectTag == "PLACEMENT" && fiber.dom !== null){
    domParent.appendChild(fiber.dom)
  }
  else if(fiber.effectTag === "DELETION"){
    domParent.removeChild(fiber.dom)
  }
  else if(fiber.effectTag === "UPDATE" && fiber.dom != null){
    updateDom(fiber.dom, fiber.alternate.props, fiber.props)
  }
domParent.appendChild(fiber.dom)
commitWork(fiber.child)
commitWork(fiber.sibling)
}

const isGone = (prev, next) => key => key =>  !(key in next)
const isNew = (prev , next) => key => prev[key] !==  next[key]
const isEvent = key => key.startsWith("on");
const isProperty = key => key != "children" && !isEvent(key)


function updateDom(dom, prevProps, nextProps){

Object.keys(prevProps).filter(isProperty).filter(isGone(prevProps,nextProps)).forEach(name => {
    dom[name] = ""
  } )

  Object.keys(nextProps).filter(isProperty).filter(isNew(prevProps, nextProps)).forEach((name)=> {
  dom[name] = nextProps[name]
  })

  Object.keys(prevProps).filter(isEvent).filter(key => !(key in nextProps) ||  isNew(prevProps, nextProps)(key)).forEach(name=> {
      const eventType = name.toLowerCase().substring(2);
  
      dom.removeEventListener(eventType, prevProps[name])
  })


  Object.key(nextProps).filter(isEvent).filter(isNew(prevProps, nextProps)).forEach(name=> {
    const eventType = name.toLowerCase().substring(2);

    dom.addEventListener(eventType, nextProps[name])
    
  })

}


function performUnitOfWork(fiber){
  if(!fiber.dom){
    fiber.dom  =  createDom(fiber)
  }
  if(fiber.parent){
    fiber.parent.appendChild(fiber.dom)
  }

  let elements = fiber.props.children
  reconcileChildren(fiber, elements)

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


function reconcileChildren(fiber, elements){
  let prevSibling = null
  let index = 0
  let oldFiber = fiber.alternate && fiber.alternate.child
  let newFiber = null 
  

  while(index <  elements.length || oldFiber != null){
    let element = elements[index]
    let sameType = oldFiber && element && element.type == oldFiber.type
    if(sameType){
      //TODO : update the Node
      newFiber = {
        type: fiber.alternate.type,
        props: element.props,
        dom:  oldFiber.dom,
        parent:  fiber,
        alternate: oldFiber,
        effectTag: "UPDATE"
      }
    }

    if(element && !sameType){
      //TODO: Add new node
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: fiber,
        alternate: null,
        effectTag: "PLACEMENT"
      }
    }

    if(oldFiber && !sameType){
      oldFiber.effectTag  = "DELETION"
      deletions.push(oldFiber)
    }
 
    if(index == 0){
      fiber.child = newFiber
    }else{
      prevSibling.sibling =  newFiber
    }

    prevSibling = newFiber
    index++
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
