import { gql, QueryLazyOptions, useLazyQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { UserProfileSetType } from "../store/user/Reducer";

export const Me = gql`
  query me {
    me {
      ... on EntityResult {
        messages
      }
      ... on User {
        id
        userName
        threads {
          id
          title
        }
        threadItems {
          id
          thread {
            id
          }
          body
        }
      }
    }
  }
`;

// execMe: Load Me from server(graphql now)
// deleteMe: delete Me from redux
// updateMe: update Me in redux
export interface UseRefreshReduxMeResult {
  execMe: (options?: QueryLazyOptions<Record<string, any>> | undefined) => void;
  deleteMe: () => void;
  updateMe: () => void;
}

const UseRefreshReduxMe = (): UseRefreshReduxMeResult => {
  const [execMe, { data }] = useLazyQuery(Me);
  const reduxDispatcher = useDispatch();

  const deleteMe = () => {
    reduxDispatcher({
      type: UserProfileSetType,
      payload: null,
    });
  };

  // TODO: May you should return some as tip
  // Note: you should always use the func after execMe, when the data is ready
  const updateMe = () => {
    if (data && data.me && data.me.userName) {
      reduxDispatcher({
        type: UserProfileSetType,
        payload: data.me,
      });
    }
  };

  return { execMe, deleteMe, updateMe };
};

export default UseRefreshReduxMe;
