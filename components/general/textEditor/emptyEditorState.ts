import { EditorState } from "lexical";

export default function emptyEditorState(initialText?: string): string {
 return JSON.stringify({
    root: {
      children: [
        {
          children: [
            {
              detail:0,
              format:0,
              mode: "normal",
              style: "",
              text: `${initialText || ""}`,
              type: "text",
              version: 1
            }
          ],
          direction: "ltr",
          format: "start",
          indent: 0,
          type: "paragraph",
          version: 1
        }
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1
    }
  });
}