type StartGameFormProps = {
  length: number;
  allowRepeats: boolean;
  onLengthChange: (value: number) => void;
  onAllowRepeatsChange: (checked: boolean) => void;
  onStartGame: () => void;
};

function StartGameForm({
  length,
  allowRepeats,
  onLengthChange,
  onAllowRepeatsChange,
  onStartGame,
}: StartGameFormProps) {
  return (
    <div>
      <div>
        <label>
          Word length:
          <input    
            className="length-input"
            type="number"
            min="1"
            value={length}
            onChange={(event) => onLengthChange(Number(event.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Include repeated letters:
          <input
            className="checkbox"
            type="checkbox"
            checked={allowRepeats}
            onChange={(event) => onAllowRepeatsChange(event.target.checked)}
          />
        </label>
      </div>

      <button className="start-button" onClick={onStartGame}>
        Start game
      </button>
    </div>
  );
}

export default StartGameForm;