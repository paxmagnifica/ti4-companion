import IconButton from '@material-ui/core/IconButton'

function RollResult({ value, highlighted, onClick }) {
  return (
    <IconButton onClick={onClick} style={{ margin: 0, padding: '0.2vh' }}>
      <div
        style={{
          backgroundColor: 'white',
          color: 'black',
          border: highlighted ? '3px solid yellow' : '3px solid black',
          height: '4.4vh',
          width: '4.4vh',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {value}
      </div>
    </IconButton>
  )
}

export function Rolls({ rolls, highlights, setHighlights }) {
  return (
    <>
      {rolls
        .sort((a, b) => b - a)
        .map((result, index) => (
          <RollResult
            highlighted={highlights[index]}
            onClick={() =>
              setHighlights((highlighted) => {
                const cp = Array(rolls).fill(false)
                if (index === 0 && highlighted[0] && !highlighted[1]) {
                  return cp
                }

                const lastResultOfTheSameValue = rolls.findLastIndex(
                  (r) => r === rolls[index],
                )

                cp.splice(
                  0,
                  lastResultOfTheSameValue + 1,
                  ...Array(lastResultOfTheSameValue + 1).fill(true),
                )

                return cp
              })
            }
            value={result}
          />
        ))}
    </>
  )
}
