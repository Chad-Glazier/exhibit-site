import styles from "./theme.module.css";

const exampleTheme = {
  ltr: styles.ltr,
  rtl: styles.rtl,
  placeholder: styles.editorPlaceholder,
  paragraph: styles.editorParagraph,
  quote: styles.editorQuote,
  heading: {
    h1: styles.editorHeadingH1,
    h2: styles.editorHeadingH2
  },
  list: {
    nested: {
      listitem: styles.editorNestedListitem
    },
    ol: styles.editorListOl,
    ul: styles.editorListUl,
    listitem: styles.editorListitem
  },
  image: styles.editorImage,
  link: styles.editorLink,
  text: {
    bold: styles.editorTextBold,
    italic: styles.editorTextItalic,
    overflowed: styles.editorTextOverflowed,
    hashtag: styles.editorTextHashtag,
    underline: styles.editorTextUnderline,
    strikethrough: styles.editorTextStrikethrough,
    underlineStrikethrough: styles.editorTextUnderlineStrikethrough,
  }
};

export default exampleTheme;