import './App.css'
import { BaseEditor, Descendant, Editor, Transforms, createEditor, Element as SlateElement } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { useCallback, useState } from 'react'




type CustomText = { text: string, bold?: boolean }
type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CodeElement = { type: 'code'; children: CustomText[] }


declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Text: CustomText
    Element: CustomElement | CodeElement
  }
}








// Define our own custom set of helpers.
const CustomEditor = {
  // Helpers
  isBoldMarkActive(editor: ReactEditor) {
    const marks = Editor.marks(editor)
    return marks ? marks.bold === true : false
  },
  isCodeBlockActive(editor: ReactEditor) {
    const [match] = Editor.nodes(editor, {
      match: n => SlateElement.isElement(n) && n.type === 'code',
    })

    return !!match
  },

  // Togglers
  toggleBoldMark(editor: ReactEditor) {
    const isActive = CustomEditor.isBoldMarkActive(editor)
    if (isActive) {
      Editor.removeMark(editor, 'bold')
    } else {
      Editor.addMark(editor, 'bold', true)
    }
  },
  toggleCodeBlock(editor: ReactEditor) {
    const isActive = CustomEditor.isCodeBlockActive(editor)
    Transforms.setNodes(
      editor,
      { type: isActive ? undefined : 'code' }, //!@#!@#!@# changed null to undefined. idk if this will should work or will cause future issues
      { match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n) }
    )
  },
}

















const initialValue: Descendant[] = [{
  type: 'paragraph',
  children: [{ text: 'A line of text in a paragraph.' }],
}]


const App = () => {
  const [editor] = useState(() => withReact(createEditor()))

  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])


  const renderLeaf = useCallback((props: any) => {
    return <Leaf {...props} />
  }, [])

  return <Slate editor={editor} initialValue={initialValue}>

    <div>
      <button
        onMouseDown={event => {
          event.preventDefault()
          CustomEditor.toggleBoldMark(editor)
        }}
      >
        Bold
      </button>
      <button
        onMouseDown={event => {
          event.preventDefault()
          CustomEditor.toggleCodeBlock(editor)
        }}
      >
        Code Block
      </button>
    </div>



    <Editable
      renderLeaf={renderLeaf}
      renderElement={renderElement}
      // Define a new handler which prints the key that was pressed.
      onKeyDown={e => {
        if (!e.ctrlKey) {
          return
        }

        e.preventDefault()
        switch (e.key) {
          case "`":
            CustomEditor.toggleCodeBlock(editor)
            break
          case "b":
            CustomEditor.toggleBoldMark(editor)
            break
        }
      }}
    />
  </Slate>
}






// Define a React component to render leaves with bold text.
const Leaf = (props: any) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      {props.children}
    </span>
  )
}

// Define a React component renderer for our code blocks.
const CodeElement = (props: any) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const DefaultElement = (props: any) => {
  return <p {...props.attributes}>{props.children}</p>
}

export default App
