import { Dispatch } from "react";

// TODO: the setDisabled is not so good for the func name
export const allowSubmit = (
  dispatch: Dispatch<any>,
  msg: string,
  setDisabled: boolean
) => {
  dispatch({ type: "isSubmitDisabled", payload: setDisabled });
  dispatch({ payload: msg, type: "resultMsg" });
};
