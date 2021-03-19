import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";

import "react-markdown-editor-lite/lib/index.css";
import { FC, useState } from "react";

const mdParser = new MarkdownIt();

export class MDEditorProps {
  existingBody?: string;
  readOnly?: boolean = false;
  sendOutBody?: (
    data: {
      text: string;
      html: string;
    },
    event?: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  config?: any;
}

const MarkdownEditor: FC<MDEditorProps> = (props) => {
  const [body, setBody] = useState("");
  const view = props.readOnly
    ? { menu: false, md: false, html: true }
    : { menu: true, md: true, html: true };

  const handleChange = (data: { text: string; html: string }) => {
    setBody(data.text);
    if (props.sendOutBody) {
      props.sendOutBody({ text: data.text, html: data.html });
    }
  };

  return (
    <MdEditor
      style={{ height: "500px" }}
      renderHTML={(text) => mdParser.render(text)}
      onChange={handleChange}
      readOnly={props.readOnly}
      view={view}
      config={props.config}
      value={props.readOnly ? props.existingBody : body}
    />
  );
};

export default MarkdownEditor;
