import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { parseISO } from "date-fns";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import Category from "../../../models/Category";
import ThreadModel from "../../../models/Thread";
import { AppState } from "../../../store/AppState";
import Nav from "../../areas/Nav";
import ThreadPointsBar from "../../points/ThreadPointsBar";
import ThreadPointsInline from "../../points/ThreadPointsInline";
import "./Thread.css";
import ThreadBody from "./ThreadBody";
import ThreadCategory from "./ThreadCategory";
import ThreadHeader from "./ThreadHeader";
import ThreadResponse from "./ThreadResponse";
import ThreadResponsesBuilder from "./ThreadResponsesBuilder";
import ThreadTitle from "./ThreadTitle";

//TODO: if need, you should put the gql schema in some files
const GetThreadById = gql`
  query GetThreadById($id: ID!) {
    getThreadById(id: $id) {
      ... on EntityResult {
        messages
      }

      ... on Thread {
        id
        user {
          id
          userName
        }
        lastModifiedOn
        title
        body
        points
        category {
          id
          name
        }
        threadItems {
          id
          body
          points
          createdOn
          thread {
            id
          }
          user {
            id
            userName
          }
        }
      }
    }
  }
`;

const CreateThread = gql`
  mutation createThread(
    $userId: ID!
    $categoryId: ID!
    $title: String!
    $body: String!
  ) {
    createThread(
      userId: $userId
      categoryId: $categoryId
      title: $title
      body: $body
    ) {
      messages
    }
  }
`;

//Note: I use react reducer to manager local variable like form's data
const threadReducer = (state: any, action: any) => {
  switch (action.type) {
    case "userId":
      return { ...state, userId: action.payload };
    case "category":
      return { ...state, category: action.payload };
    case "title":
      return { ...state, title: action.payload };
    case "body":
      return { ...state, body: action.payload };
    default:
      throw new Error("Unknown action type");
  }
};

const Thread = () => {
  const { width } = useWindowDimensions();
  const [execGetThreadById, { data: threadData }] = useLazyQuery(
    GetThreadById,
    { fetchPolicy: "no-cache" }
  );
  const { id } = useParams<{ id: string }>();
  const [thread, setThread] = useState<ThreadModel | undefined>();
  const [readOnly, setReadOnly] = useState(false);
  const user = useSelector((state: AppState) => state.user);
  const [{ userId, category, title, body }, threadReducerDispatch] = useReducer(
    threadReducer,
    {
      userId: user ? user.id : "0",
      category: undefined,
      title: "",
      body: "",
    }
  );

  const [postMsg, setPostMsg] = useState("");
  const [execCreateThread] = useMutation(CreateThread);
  const history = useHistory();

  const refreshThread = useCallback(async () => {
    if (id && parseInt(id) > 0) {
      await execGetThreadById({
        variables: {
          id,
        },
      });
    }
  }, [id, execGetThreadById]);

  useEffect(() => {
    refreshThread();
  }, [refreshThread]);

  useEffect(() => {
    threadReducerDispatch({
      type: "userId",
      payload: user ? user.id : "0",
    });
  }, [user]);

  useEffect(() => {
    if (threadData && threadData.getThreadById) {
      threadData.getThreadById.lastModifiedOn = parseISO(
        threadData.getThreadById.lastModifiedOn
      );
      setThread(threadData.getThreadById);
      setReadOnly(true);
    } else {
      setThread(undefined);
      setReadOnly(false);
    }
  }, [threadData]);

  const receiveSelectedCategory = (cat: Category) => {
    threadReducerDispatch({
      type: "category",
      payload: cat,
    });
  };

  const receiveTitle = (updatedTitle: string) => {
    threadReducerDispatch({
      type: "title",
      payload: updatedTitle,
    });
  };

  const receiveBody = (data: { text: string }) => {
    threadReducerDispatch({
      type: "body",
      payload: data.text,
    });
  };

  const onClickPost = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    // updated data
    if (!userId || userId === "0") {
      setPostMsg("You must be logged in before you can post.");
    } else if (!category) {
      setPostMsg("Please select a category for your post.");
    } else if (!title) {
      setPostMsg("Please enter a title.");
    } else if (!body) {
      setPostMsg("Please enter a body.");
    } else {
      setPostMsg("");
      const newThread = {
        userId,
        categoryId: category?.id,
        title,
        body,
      };
      // send to server to save
      const { data: createThreadMsg } = await execCreateThread({
        variables: newThread,
      });
      if (
        createThreadMsg.createThread &&
        createThreadMsg.createThread.messages &&
        !isNaN(createThreadMsg.createThread.messages[0])
      ) {
        setPostMsg("Thread posted successfully.");
        history.push(`/thread/${createThreadMsg.createThread.messages[0]}`);
      } else {
        setPostMsg(createThreadMsg.createThread.messages[0]);
      }
    }
  };

  return (
    <div className="screen-root-container">
      <div className="thread-nav-container">
        <Nav />
      </div>
      <div className="thread-content-container">
        <div className="thread-content-post-container">
          {width <= 768 && thread ? (
            <ThreadPointsInline
              points={thread?.points || 0}
              threadId={thread?.id}
              refreshThread={refreshThread}
              allowUpdatePoints={true}
            />
          ) : null}

          <ThreadHeader
            userName={thread ? thread.user.userName : user?.userName}
            lastModifiedOn={thread ? thread.lastModifiedOn : undefined}
            title={thread ? thread.title : title}
          />
          <ThreadCategory
            category={thread ? thread.category : category}
            sendOutSelectedCategory={receiveSelectedCategory}
          />
          <ThreadTitle
            title={thread ? thread.title : ""}
            readOnly={thread ? readOnly : false}
            sendOutTitle={receiveTitle}
          />
          <ThreadBody
            body={thread ? thread.body : ""}
            readOnly={id ? true : false}
            sendOutBody={receiveBody}
          />
          {thread ? null : (
            <>
              <div style={{ marginTop: ".5em" }}>
                <button className="action-btn" onClick={onClickPost}>
                  Post
                </button>
              </div>
              <strong>{postMsg}</strong>
            </>
          )}
        </div>
        <div className="thread-content-points-container">
          <ThreadPointsBar
            points={thread?.points || 0}
            responseCount={
              (thread && thread.threadItems && thread.threadItems.length) || 0
            }
            threadId={thread?.id || "0"}
            allowUpdatePoints={id ? true : false}
            refreshThread={refreshThread}
          />
        </div>
      </div>
      {thread ? (
        <div className="thread-content-response-container">
          <hr className="thread-section-divider" />
          <div style={{ marginBottom: ".5em" }}>
            <strong>Post Response</strong>
          </div>
          <ThreadResponse
            body={""}
            userName={user?.userName}
            points={0}
            readOnly={false}
            threadItemId={"0"}
            threadId={thread.id}
            refreshThread={refreshThread}
          />
        </div>
      ) : null}
      {thread ? (
        <div className="thread-content-response-container">
          <hr className="thread-section-divider" />
          <ThreadResponsesBuilder
            threadItems={thread?.threadItems}
            readOnly={true}
            refreshThread={refreshThread}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Thread;
