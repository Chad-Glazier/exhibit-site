import theme from "./themes/theme";
import styles from "./TextEditor.module.css";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import { EditorState, LexicalEditor } from "lexical";

export default function TextEditor({
  onChange,
  className,
  innerClassName,
  initialState,
  placeholder,
  readonly
}: {
  className?: string;
  innerClassName?: string;
  title?: string;
  placeholder?: string;
  onChange?: (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => void;
  initialState?: string;
  readonly?: boolean;
}) {  
  return (
    <LexicalComposer 
      initialConfig={{
        editorState: initialState,
        theme,
        onError(error: Error) {
          throw error;
        },
        nodes: [
          HeadingNode,
          ListNode,
          ListItemNode,
          QuoteNode,
          CodeNode,
          CodeHighlightNode,
          TableNode,
          TableCellNode,
          TableRowNode,
          AutoLinkNode,
          LinkNode
        ],
        namespace: "TextEditor",
        editable: !readonly
      }}
    >
      <div
        className={styles.editorContainer + ` ${className ? className : ""}`}
      >
        {!readonly &&
          <ToolbarPlugin />
        }
        <div className={styles.editorInner + ` ${innerClassName ? innerClassName : ""}`}>
          <RichTextPlugin
            contentEditable={<ContentEditable className={styles.editorInput}/>}
            placeholder={<div className={theme.placeholder}>{readonly ? "" : placeholder ? placeholder : "Enter text..."}</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin onChange={onChange ?? (() => {})} />
        </div>
      </div>
    </LexicalComposer>
  );
}
