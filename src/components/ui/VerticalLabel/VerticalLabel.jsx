import style from './VerticalLabel.module.css';

const VerticalLabel = ({ text }) => {
  return (
    <aside className={style.verticalLabel}>
      {text}
    </aside>
  );
};

export default VerticalLabel;