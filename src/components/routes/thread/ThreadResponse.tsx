import React, { FC, useEffect, useState } from "react";
import MDEditor from "../../editor2/MarkdownEditor";
import UserNameAndTime from "./UserNameAndTime";
import ThreadPointsInline from "../../points/ThreadPointsInline";
import { gql, useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import { AppState } from "../../../store/AppState";
import { parseISO } from "date-fns";

const CreateThreadItem = gql`
  mutation createThreadItem($userId: ID!, $threadId: ID!, $body: String!) {
    createThreadItem(userId: $userId, threadId: $threadId, body: $body) {
      messages
    }
  }
`;

interface ThreadResponseProps {
  body?: string;
  userName?: string;
  lastModifiedOn?: Date;
  points: number;
  readOnly: boolean;
  threadItemId: string;
  threadId?: string;
  refreshThread?: () => void;
}

const ThreadResponse: FC<ThreadResponseProps> = ({
  body,
  userName,
  lastModifiedOn,
  points,
  readOnly,
  threadItemId,
  threadId,
  refreshThread,
}) => {
  const user = useSelector((state: AppState) => state.user);
  const [execCreateThreadItem] = useMutation(CreateThreadItem);
  const [postMsg, setPostMsg] = useState("");
  const [bodyToSave, setBodyToSave] = useState("");

  useEffect(() => {
    if (body) {
      setBodyToSave(body);
    }
  }, [body]);

  const onClickPost = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!(user && user.id)) {
      setPostMsg("Please login before adding a response.");
    } else if (!threadId) {
      setPostMsg("A parent thread must exist before a response can be posted.");
    } else if (!bodyToSave) {
      setPostMsg("Please enter some text.");
    } else {
      const res = await execCreateThreadItem({
        variables: {
          userId: user.id,
          threadId,
          body: bodyToSave,
        },
      });
      if (isNaN(res.data.createThreadItem.messages[0])) {
        setPostMsg(res.data.createThreadItem.messages[0]);
      } else {
        refreshThread && refreshThread();
      }
    }
  };

  const receiveBody = (data: { text: string; html: string }) => {
    setBodyToSave(data.text);
  };

  let modifiedOn: Date | undefined;
  if (lastModifiedOn) {
    modifiedOn = parseISO(lastModifiedOn.toString());
  }
  return (
    <div>
      <div>
        <UserNameAndTime userName={userName} lastModifiedOn={modifiedOn} />
        {readOnly ? threadItemId : ""}
        {readOnly ? (
          <span style={{ display: "inline-block", marginLeft: "1em" }}>
            <ThreadPointsInline
              points={points || 0}
              threadItemId={threadItemId}
              refreshThread={refreshThread}
              allowUpdatePoints={true}
            />
          </span>
        ) : null}
      </div>
      <div className="thread-response-body">
        <MDEditor
          existingBody={bodyToSave}
          readOnly={readOnly}
          sendOutBody={receiveBody}
        />
      </div>
      {!readOnly && threadId ? (
        <>
          <div style={{ marginTop: ".5em" }}>
            <button className="action-btn" onClick={onClickPost}>
              Post Response
            </button>
          </div>
          <strong>{postMsg}</strong>
        </>
      ) : null}
    </div>
  );
};

export default ThreadResponse;
