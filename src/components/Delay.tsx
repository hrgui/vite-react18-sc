import styles from "./Delay.module.css";
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

  console.log(styles);

  return <div className={styles.container}>{JSON.stringify(data)}</div>;
};

export default Delay;
