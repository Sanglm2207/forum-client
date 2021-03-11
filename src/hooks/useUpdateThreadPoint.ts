import { gql, useMutation } from "@apollo/client";

const UpdateThreadPoint = gql`
  mutation UpdateThreadPoint($threadId: ID!, $increment: Boolean!) {
    updateThreadPoint(threadId: $threadId, increment: $increment)
  }
`;

const useUpdateThreadPoint = (
  refreshThread?: () => void,
  threadId?: string
) => {
  const [execUpdateThreadPoint] = useMutation(UpdateThreadPoint);

  const onClickIncThreadPoint = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.preventDefault();

    const result = await execUpdateThreadPoint({
      variables: {
        threadId,
        increment: true,
      },
    });
    console.log("useUpdateThreadPoint: ", result);
    refreshThread && refreshThread();
  };

  const onClickDecThreadPoint = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.preventDefault();
    await execUpdateThreadPoint({
      variables: {
        threadId,
        increment: false,
      },
    });
    refreshThread && refreshThread();
  };

  return {
    onClickIncThreadPoint,
    onClickDecThreadPoint,
  };
};

export default useUpdateThreadPoint;
