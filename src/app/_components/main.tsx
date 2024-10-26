import WrapSessionProvider from "./WrapSessionProvider";
import NewContents from "./NewContents";

const Main = async () => {
  return (
    <>
      <WrapSessionProvider>
        <NewContents />
      </WrapSessionProvider>
    </>
  );
};

export default Main;
