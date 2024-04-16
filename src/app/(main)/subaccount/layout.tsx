type Props = {
  children: string;
};

const layout = async ({ children }: Props) => {
  return <div>{children}</div>;
};

export default layout;
