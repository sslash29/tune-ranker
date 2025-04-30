function Tags({ tags }) {
  return (
    <div className="flex gap-2 self-start">
      {tags?.map((tag, index) => (
        <button
          key={index}
          className=" border-2 border-blue-300 text-blue-300 p-1"
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}

export default Tags;
