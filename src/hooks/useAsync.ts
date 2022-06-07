const cache: any = {};

export default function useAsync(key: string, fetcher: any) {
  if (!cache[key]) {
    let data: any;
    let error: any;
    let promise: any;
    cache[key] = () => {
      if (error !== undefined || data !== undefined) return { data, error };
      if (!promise) {
        promise = fetcher()
          .then((r: any) => {
            return (data = r);
          })
          // Convert all errors to plain string for serialization
          .catch((e: any) => (error = e + ""));
      }
      throw promise;
    };
  }
  return cache[key]();
}
