import WrapSessionProvider from "./WrapSessionProvider";
import NewContents from "./NewContents";

const Main = async () => {
  return (
    <>
      <div>メイン</div>
      <WrapSessionProvider>
        <NewContents />
      </WrapSessionProvider>
    </>
  );
};

export default Main;
