import React from "react";
import useAsync from "../hooks/useAsync";

type Props = {
  delay: number;
};

function wait(time: number) {
  return new Promise((resolve, reject) => setTimeout(resolve, time));
}

const Delay = (props: Props) => {
  const data = useAsync(props.delay + "", async () => {
    await wait(props.delay);

    return { delay: props.delay };
  });

  return <div>{JSON.stringify(data)}</div>;
};

export default Delay;
