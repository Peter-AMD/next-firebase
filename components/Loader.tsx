interface Props {
  show: boolean;
}

export const Loader: React.FC<Props> = ({ show }) => {
  return show ? <div className="loader" /> : null;
};

export default Loader;
