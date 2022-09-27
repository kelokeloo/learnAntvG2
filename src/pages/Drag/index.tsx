const Drag = () => {
  const dragstart: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.dataTransfer.setData("text/plain", "data");
  };

  const drag: React.DragEventHandler<HTMLDivElement> = (e) => {};

  const dragend: React.DragEventHandler<HTMLDivElement> = (e) => {};

  const dragenter: React.DragEventHandler<HTMLDivElement> = (e) => {};

  const dragover: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };
  const dragleave: React.DragEventHandler<HTMLDivElement> = (e) => {};
  const drop: React.DragEventHandler<HTMLDivElement> = (e) => {
    const data = e.dataTransfer.getData("text/plain");
    console.log("data", data);
  };

  return (
    <div>
      <div
        id="sourceRect"
        className="w-20 h-20 bg-slate-200"
        onDragStart={dragstart}
        onDrag={drag}
        onDragEnd={dragend}
      ></div>
      <div
        id="targetRect"
        className="w-20 h-20 bg-blue-200"
        onDragEnter={dragenter}
        onDragOver={dragover}
        // onDragLeave={dragleave}
        onDrop={drop}
      ></div>
    </div>
  );
};

export default Drag;
