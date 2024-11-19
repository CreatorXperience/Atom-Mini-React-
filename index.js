
function createElement(type, props, ...children){
return {
    type,
    props: {
      ...props,
      children
    },
  } 
}

console.log(createElement("h1", null,  "peter"))
