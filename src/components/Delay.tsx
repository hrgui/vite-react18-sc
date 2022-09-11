import styles from "./Delay.module.css";
import { createFetchStore } from "react-suspense-fetch";

const store = createFetchStore(async (delay: number) => {
  await wait(delay);
  return { delay };
});

store.prefetch(1250);
store.prefetch(2500);
store.prefetch(5000);

type Props = {
  delay: number;
};

function wait(time: number) {
  return new Promise((resolve, reject) => setTimeout(resolve, time));
}

const Delay = (props: Props) => {
  const data = store.get(props.delay);

  return <div className={styles.container}>{JSON.stringify(data)}</div>;
};

export default Delay;
