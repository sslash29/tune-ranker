function Tags({ tags }) {
  return (
    <div>
      {tags?.map((tag, index) => (
        <button key={index} className="tag-button">
          {tag.name}
        </button>
      ))}
    </div>
  );
}

export default Tags;
