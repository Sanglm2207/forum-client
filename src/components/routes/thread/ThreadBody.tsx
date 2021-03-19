import React, { FC } from "react";
import MDEditor from "../../editor2/MarkdownEditor";

interface ThreadBodyProps {
  body?: string;
  readOnly: boolean;
  sendOutBody?: (
    data: {
      text: string;
      html: string;
    },
    event?: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
}

const ThreadBody: FC<ThreadBodyProps> = ({ body, readOnly, sendOutBody }) => {
  return (
    <div className="thread-body-container">
      <strong>Body</strong>
      <div className="thread-body-editor">
        <MDEditor
          existingBody={body}
          readOnly={readOnly}
          sendOutBody={sendOutBody}
        />
      </div>
    </div>
  );
};

export default ThreadBody;
