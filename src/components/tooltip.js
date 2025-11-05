const Tooltip = ({ content, x, y, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div id="tooltip" style={{left: x, top: y}}>
      {content}
    </div>
  );
};

export default Tooltip