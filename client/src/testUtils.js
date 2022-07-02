import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'

import { GameVersionProvider } from './GameComponents'

export function renderWithProviders(client, ui) {
  const { rerender, ...result } = render(
    <QueryClientProvider client={client}>
      <GameVersionProvider>{ui}</GameVersionProvider>
    </QueryClientProvider>,
  )

  return {
    ...result,
    rerender: (rerenderUi) =>
      rerender(
        <QueryClientProvider client={client}>
          <GameVersionProvider>{rerenderUi}</GameVersionProvider>
        </QueryClientProvider>,
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
