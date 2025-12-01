import type { APIRoute } from 'astro'
import { graphqlClient } from '../../lib/graphqlClient'

export const prerender = false

const REQUEST_QUERY = `
  query FindRequest($reqNumber: String!, $pin: String!) {
    Requests(where: { reqNumber: { equals: $reqNumber }, pin: { equals: $pin } }) {
      docs {
        id
        reqNumber
        applicantName
        status
        submittedAt
        notes
        document {
          url
        }
      }
    }
  }
`

const parseBody = async (request: Request) => {
  const contentType = request.headers.get('content-type')?.toLowerCase() ?? ''
  let reqNumber: string | undefined
  let pin: string | undefined

  try {
    if (contentType.includes('application/json')) {
      const json = await request.json().catch(() => null)
      if (json && typeof json === 'object') {
        const payload = json as Record<string, unknown>
        reqNumber = typeof payload.reqNumber === 'string' ? payload.reqNumber : undefined
        pin = typeof payload.pin === 'string' ? payload.pin : undefined
      }
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const params = new URLSearchParams(await request.text())
      reqNumber = params.get('reqNumber') ?? undefined
      pin = params.get('pin') ?? undefined
    } else if (contentType.includes('multipart/form-data')) {
      const form = await request.formData()
      const reqNumValue = form.get('reqNumber')
      const pinValue = form.get('pin')
      reqNumber = typeof reqNumValue === 'string' ? reqNumValue : undefined
      pin = typeof pinValue === 'string' ? pinValue : undefined
    } else {
      const raw = (await request.text())?.trim()
      if (raw) {
        try {
          const json = JSON.parse(raw)
          reqNumber = json?.reqNumber
          pin = json?.pin
        } catch {
          const params = new URLSearchParams(raw)
          reqNumber = params.get('reqNumber') ?? undefined
          pin = params.get('pin') ?? undefined
        }
      }
    }
  } catch {
    // fall through to URL param parsing
  }

  const url = new URL(request.url)
  reqNumber = (reqNumber ?? url.searchParams.get('reqNumber') ?? undefined)?.trim()
  pin = (pin ?? url.searchParams.get('pin') ?? undefined)?.trim()

  return { reqNumber, pin }
}

export const POST: APIRoute = async ({ request }) => {
  const { reqNumber, pin } = await parseBody(request)

  if (!reqNumber || !pin) {
    return new Response(JSON.stringify({ error: 'Missing reqNumber or pin' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const data = await graphqlClient.request(REQUEST_QUERY, { reqNumber, pin })
    return new Response(JSON.stringify(data?.Requests ?? {}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Request failed'
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
