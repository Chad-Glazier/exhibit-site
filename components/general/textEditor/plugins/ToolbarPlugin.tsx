import styles from "./ToolbarPlugin.module.css";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LegacyRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $getNodeByKey,
  LexicalNode,
  LexicalEditor,
  RangeSelection,
  NodeSelection,
  GridSelection
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $isParentElementRTL,
  $wrapNodes,
  $isAtNodeEnd
} from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode
} from "@lexical/list";
import { createPortal } from "react-dom";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode
} from "@lexical/rich-text";
import Image from "next/image";

const LowPriority = 1;

const supportedBlockTypes = new Set([
  "paragraph",
  "quote",
  "h1",
  "h2",
  "ul",
  "ol"
]);

type BlockTypes = "paragraph"|"quote"|"h1"|"h2"|"ul"|"ol";

const blockTypeToBlockName = {
  h1: "Large Heading",
  h2: "Small Heading",
  ol: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
  ul: "Bulleted List"
};

const blockTypeToImage = {
  h1: "/editor-icons/type-h1.svg",
  h2: "/editor-icons/type-h2.svg",
  ol: "/editor-icons/list-ol.svg",
  paragraph: "/editor-icons/text-paragraph.svg",
  quote: "/editor-icons/chat-square-quote.svg",
  ul: "/editor-icons/list-ul.svg"
}

function Divider() {
  return <div className={styles.divider} />;
}

function positionEditorElement(editor: LexicalNode, rect: DOMRect | null) {
  if (rect === null) {
    editor.style.opacity = "0";
    editor.style.top = "-1000px";
    editor.style.left = "-1000px";
  } else {
    editor.style.opacity = "1";
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`;
  }
}

function FloatingLinkEditor({ editor }: { editor: LexicalEditor }) {
  const editorRef = useRef<LexicalNode | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mouseDownRef = useRef(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState<null | RangeSelection | NodeSelection | GridSelection>(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection() as null | RangeSelection | NodeSelection | GridSelection;
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl("");
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null && 
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect: DOMRect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner: Element = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== "link-input") {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl("");
    }

    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        LowPriority
      )
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  return (
    <div ref={editorRef as LegacyRef<HTMLDivElement> | undefined} className={styles.linkEditor}>
      {isEditMode ? (
        <input
          ref={inputRef}
          className={styles.linkInput}
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (lastSelection !== null) {
                if (linkUrl !== "") {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                }
                setEditMode(false);
              }
            } else if (event.key === "Escape") {
              event.preventDefault();
              setEditMode(false);
            }
          }}
        />
      ) : (
        <>
          <div className={styles.linkInput}>
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              {linkUrl}
            </a>
            <Image
              src="/editor-icons/pencil-fill.svg"
              width={16}
              height={16}
              alt="Edit Link"
              className={styles.linkEdit}
              role="button"
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setEditMode(true);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

function Select({ onChange, className, options, value }: {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  options: string[];
  value: string;
}) {
  return (
    <select className={className} onChange={onChange} value={value}>
      <option hidden={true} value="" />
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function getSelectedNode(selection: RangeSelection | GridSelection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

function BlockOptionsDropdownList({
  editor,
  blockType,
  toolbarRef,
  setShowBlockOptionsDropDown
}: {
  editor: LexicalEditor;
  blockType: string;
  toolbarRef: React.RefObject<HTMLDivElement>;
  setShowBlockOptionsDropDown: (show: boolean) => void;
}) {
  const dropDownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropDown = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${left}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = (event: any) => {
        const target = event.target;

        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false);
        }
      };
      document.addEventListener("click", handle);

      return () => {
        document.removeEventListener("click", handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatLargeHeading = () => {
    if (blockType !== "h1") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h1"));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatSmallHeading = () => {
    if (blockType !== "h2") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h2"));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, (() => {})());
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, (() => {})());
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, (() => {})());
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, (() => {})());
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  return (
    <div className={styles.dropdown} ref={dropDownRef}>
      <button className={styles.item} onClick={formatParagraph}>
        <Image src={blockTypeToImage.paragraph} width={16} height={16} alt="i" className={styles.icon + " " + styles.paragraph} />
        <span className={styles.text}>Normal</span>
        {blockType === "paragraph" && <span className={styles.active} />}
      </button>
      <button className={styles.item} onClick={formatLargeHeading}>
        <Image src={blockTypeToImage.h1} width={16} height={16} alt="i" className={styles.icon + " " + styles.largeHeading} />
        <span className={styles.text}>Large Heading</span>
        {blockType === "h1" && <span className={styles.active} />}
      </button>
      <button className={styles.item} onClick={formatSmallHeading}>
        <Image src={blockTypeToImage.h2} width={16} height={16} alt="i" className={styles.icon + " " + styles.smallHeading} />
        <span className={styles.text}>Small Heading</span>
        {blockType === "h2" && <span className={styles.active} />}
      </button>
      <button className={styles.item} onClick={formatBulletList}>
        <Image src={blockTypeToImage.ul} width={16} height={16} alt="i" className={styles.icon + " " + styles.bulletList} />
        <span className={styles.text}>Bullet List</span>
        {blockType === "ul" && <span className={styles.active} />}
      </button>
      <button className={styles.item} onClick={formatNumberedList}>
        <Image src={blockTypeToImage.ol} width={16} height={16} alt="i" className={styles.icon + " " + styles.numberedList} />
        <span className={styles.text}>Numbered List</span>
        {blockType === "ol" && <span className={styles.active} />}
      </button>
      <button className={styles.item} onClick={formatQuote}>
        <Image src={blockTypeToImage.quote} width={16} height={16} alt="i" className={styles.icon + " " + styles.quote} />
        <span className={styles.text}>Quote</span>
        {blockType === "quote" && <span className={styles.active} />}
      </button>
    </div>
  );
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState<BlockTypes>("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState<string | null>(null);
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] = useState(
    false
  );
  const [isRTL, setIsRTL] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type as BlockTypes);
        }
      }
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsRTL($isParentElementRTL(selection));

      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <div className={styles.toolbar} ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, (() => {})());
        }}
        className={styles.toolbarItem + " " + styles.spaced}
        aria-label="Undo"
      >
        <Image width={16} height={16} alt="i" src="/editor-icons/arrow-counterclockwise.svg" className={styles.format + " " + styles.undo} />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, (() => {})());
        }}
        className={styles.toolbarItem}
        aria-label="Redo"
      >
        <Image width={16} height={16} alt="i" src="/editor-icons/arrow-clockwise.svg" className={styles.format + " " + styles.redo} />
      </button>
      <Divider />
      {supportedBlockTypes.has(blockType) && (
        <>
          <button
            className={styles.toolbarItem + " " + styles.blockControls}
            onClick={() =>
              setShowBlockOptionsDropDown(!showBlockOptionsDropDown)
            }
            aria-label="Formatting Options"
          >
            <Image src={blockTypeToImage[blockType]} width={16} height={16} alt="i" className={styles.icon + " " + styles.blockType + " " + styles[blockType]} />
            <span className={styles.text}>{blockTypeToBlockName[blockType]}</span>
            <Image width={16} height={16} alt="i" src="/editor-icons/chevron-down.svg" className={styles.chevronDown} />
          </button>
          {showBlockOptionsDropDown &&
            createPortal(
              <BlockOptionsDropdownList
                editor={editor}
                blockType={blockType}
                toolbarRef={toolbarRef}
                setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
              />,
              document.body
            )}
          <Divider />
        </>
      )}
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={styles.toolbarItem + " " + styles.spaced + " " + (isBold ? styles.active : "")}
        aria-label="Format Bold"
      >
        <Image width={16} height={16} alt="i" src="/editor-icons/type-bold.svg" className={styles.format + " " + styles.bold} />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={styles.toolbarItem + " " + styles.spaced + " " + (isItalic ? styles.active : "")}
        aria-label="Format Italics"
      >
        <Image width={16} height={16} alt="i" src="/editor-icons/type-italic.svg" className={styles.format + " " + styles.italic} />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={styles.toolbarItem + " " + styles.spaced + " " + (isUnderline ? styles.active : "")}
        aria-label="Format Underline"
      >
        <Image width={16} height={16} alt="i" src="/editor-icons/type-underline.svg" className={styles.format + " " + styles.underline} />
      </button>
      <button
        onClick={insertLink}
        className={styles.toolbarItem + " " + styles.spaced + " " + (isLink ? styles.active : "")}
        aria-label="Insert Link"
      >
        <Image width={16} height={16} alt="i" src="/editor-icons/link.svg" className={styles.format + " " + styles.link} />
      </button>
      {isLink &&
        createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className={styles.toolbarItem + " " + styles.spaced}
        aria-label="Left Align"
      >
        <Image width={16} height={16} alt="i" src="/editor-icons/text-left.svg" className={styles.format + " " + styles.leftAlign} />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className={styles.toolbarItem + " " + styles.spaced}
        aria-label="Center Align"
      >
        <Image width={16} height={16} alt="i" src="/editor-icons/text-center.svg" className={styles.format + " " + styles.centerAlign} />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className={styles.toolbarItem + " " + styles.spaced}
        aria-label="Right Align"
      >
        <Image width={16} height={16} alt="i" src="/editor-icons/text-right.svg" className={styles.format + " " + styles.rightAlign} />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        className={styles.toolbarItem}
        aria-label="Justify Align"
      >
        <Image width={16} height={16} alt="i" src="/editor-icons/justify.svg" className={styles.format + " " + styles.justifyAlign} />
      </button>{" "}
    </div>
  );
}
