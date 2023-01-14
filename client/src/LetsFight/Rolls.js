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
          zIndex: 9001,
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
                const cp = [...highlighted]
                if (index === 0 && highlighted[0] && !highlighted[1]) {
                  return Array(cp.length).fill(false)
                }

                const isHighlighted = highlighted[index]

                if (isHighlighted) {
                  const firstResultOfTheSameValueIndex = rolls.findIndex(
                    (r) => r === rolls[index],
                  )

                  cp.splice(
                    firstResultOfTheSameValueIndex,
                    highlighted.length - firstResultOfTheSameValueIndex,
                    ...Array(
                      highlighted.length - firstResultOfTheSameValueIndex,
                    ).fill(false),
                  )

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
