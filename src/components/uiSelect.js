export const Select = (props) => {
  const { data, setActiveCategory, activeCategory } = props;

  return (
    <div>
      <select
        defaultValue={activeCategory}
        onChange={(e) => setActiveCategory(e.target.value)}
      >
        {data.map((c, i) => (
          <option key={"option-" + i} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
};
