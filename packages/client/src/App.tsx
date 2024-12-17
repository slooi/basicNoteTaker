import './App.css'
import { BaseEditor, Descendant, Editor, Transforms, createEditor, Element } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { useCallback, useState } from 'react'

// ??????????????????????????????????????????????????
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
// ??????????????????????????????????????????????????


const initialValue: Descendant[] = [{
  type: 'paragraph',
  children: [{ text: 'A line of text in a paragraph.' }],
}]



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

  return <Slate editor={editor} initialValue={initialValue} >
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
            // Determine whether any of the currently selected blocks are code blocks.
            const [match] = Editor.nodes(editor, {
              match: n => Element.isElement(n) && n.type === 'code',
            })

            // Toggle the block type depending on whether there's already a match.
            Transforms.setNodes(
              editor,
              { type: match ? 'paragraph' : 'code' },
              { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
            )
            break
          case "b":
            Editor.addMark(editor, 'bold', true)
            break
          default:
            throw new Error("UNEXPECTED ERROR HAS OCCURRED. NOT IMPLEMENTED")
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

export default App
