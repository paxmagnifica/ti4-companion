import IconButton from '@material-ui/core/IconButton'

function RollResult({ value, highlighted, onClick }) {
  return (
    <IconButton onClick={onClick} style={{ margin: 0, padding: '0.2vh' }}>
      <div
        style={{
          backgroundColor: 'white',
          color: 'black',
          border: highlighted ? '3px solid yellow' : '3px solid black',
          height: '4.5vh',
          width: '4.5vh',
          borderRadius: '3px',
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
      <div>{highlights.filter((a) => a).length}</div>
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

                cp.splice(0, index + 1, ...Array(index + 1).fill(true))

                return cp
              })
            }
            value={result}
          />
        ))}
    </>
  )
}
