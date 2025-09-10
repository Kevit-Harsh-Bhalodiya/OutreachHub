const SecondaryButton = ({ name, onClick }: { name: string; onClick: any }) => {
  return (
    <button onClick={onClick} className="">
      {name}
    </button>
  );
};

export default SecondaryButton;
