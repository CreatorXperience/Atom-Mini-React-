
function createElement(type, props, ...children){
return {
    type,
    props: {
      ...props,
      children
    },
  } 
}

console.log(createElement("hi", {title: "Hello world"},  "peter"))
