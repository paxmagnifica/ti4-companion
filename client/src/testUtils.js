import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'

export function renderWithClient(client, ui) {
  const { rerender, ...result } = render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  )

  return {
    ...result,
    rerender: (rerenderUi) =>
      rerender(
        <QueryClientProvider client={client}>{rerenderUi}</QueryClientProvider>,
      ),
  }
}

export function getTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
}
