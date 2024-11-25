### REQUIREMENTS
- REACT 16 

## Usage

```/** @jsx Didact.createElement */
function Counter() {
  const [state, setState] = Didact.useState(1);
  return (
    <h1 onClick={() => setState(c => c + 1)} style="user-select: none">
      Count: {state}
    </h1>
  );
}
const element = <Counter />;
const container = document.getElementById("root");
Didact.render(element, container);
```



# Understanding the Code: A Custom React-like Library

This code demonstrates the implementation of a simplified React-like library, showcasing key concepts like rendering, reconciliation, and hooks (`useState`). Below is a detailed breakdown of each section for mid-level engineers.

---

## 1. **Core Function: `createElement`**
This function creates a virtual DOM (VNode) representation of an element.

### Code:
```javascript
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object" ? child : createTextElement(child)
      )
    }
  };
}
```


### Key Points:

- type: Represents the element type (e.g., div, h1, or a custom component).
- props: Contains element attributes and event listeners.
- children: Nested child elements. Text nodes are converted using createTextElement.

### 2. Creating Text Nodes: createTextElement
Converts plain text into a VNode.

# Code:

```function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}
```

### Key Points:
- TEXT_ELEMENT: A special type for text nodes.
- props.nodeValue: Holds the text content.

### 3. Creating DOM Nodes: createDom
Generates actual DOM nodes from VNodes.

```function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}
```

###  Key Points:
- Creates a DOM node based on the fiber.type.
- Initializes properties and event listeners using updateDom.

### 4. Updating the DOM: updateDom
- Handles changes in DOM properties and event listeners.

### Code:

```
  function updateDom(dom, prevProps, nextProps) {
  // Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = "";
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name];
    });

  // Add new event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}
```
### Key Points:
- Event Handling: Differentiates events (onClick) from properties.
- Property Changes: Removes old properties and sets new ones.


### 5. Reconciliation: reconcileChildren
Creates and links fibers (units of work) for the new virtual DOM.

### Code:

``` function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    const sameType = oldFiber && element && element.type == oldFiber.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE"
      };
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT"
      };
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}
```
### Key Points:
- Same Type: Updates existing DOM nodes.
- Different Type: Marks for replacement or deletion.
- Fibers: Represent individual work units with links to children and siblings



markdown
Copy code
# Understanding the Code: A Custom React-like Library

This code demonstrates the implementation of a simplified React-like library, showcasing key concepts like rendering, reconciliation, and hooks (`useState`). Below is a detailed breakdown of each section for mid-level engineers.

---

## 1. **Core Function: `createElement`**
This function creates a virtual DOM (VNode) representation of an element.

### Code:
```javascript
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object" ? child : createTextElement(child)
      )
    }
  };
}
Key Points:
type: Represents the element type (e.g., div, h1, or a custom component).
props: Contains element attributes and event listeners.
children: Nested child elements. Text nodes are converted using createTextElement.
2. Creating Text Nodes: createTextElement
Converts plain text into a VNode.

Code:
javascript
Copy code
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}
Key Points:
TEXT_ELEMENT: A special type for text nodes.
props.nodeValue: Holds the text content.
3. Creating DOM Nodes: createDom
Generates actual DOM nodes from VNodes.

Code:
javascript
Copy code
function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}
Key Points:
Creates a DOM node based on the fiber.type.
Initializes properties and event listeners using updateDom.
4. Updating the DOM: updateDom
Handles changes in DOM properties and event listeners.

Code:
javascript
Copy code
function updateDom(dom, prevProps, nextProps) {
  // Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = "";
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name];
    });

  // Add new event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}
Key Points:
Event Handling: Differentiates events (onClick) from properties.
Property Changes: Removes old properties and sets new ones.
5. Reconciliation: reconcileChildren
Creates and links fibers (units of work) for the new virtual DOM.

Code:
javascript
Copy code
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    const sameType = oldFiber && element && element.type == oldFiber.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE"
      };
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT"
      };
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}
``` 
### Key Points:
- Same Type: Updates existing DOM nodes.
- Different Type: Marks for replacement or deletion.
- Fibers: Represent individual work units with links to children and siblings.

### 6. Rendering: render
Starts the rendering process.

### Code:
``` function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    alternate: currentRoot
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}
```

### Key Points:
- Wraps the root element in a fiber.
- Initializes the rendering work loop.

### 7. Work Loop and Commit Phase
## Work Loop:
Processes fibers incrementally to avoid blocking the UI.

```function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}
```
## Commit Phase:
Applies changes to the actual DOM
```function commitWork(fiber) {
  if (!fiber) return;

  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
```

### 8. Hooks: useState
A simplified state management system for function components.
## Code:

```function useState(initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach(action => {
    hook.state = action(hook.state);
  });

  const setState = action => {
    hook.queue.push(action);
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}
```

### Key Points:
- Stores the state in a fiber-specific hook array.
- Supports asynchronous updates using a queue of actions.


