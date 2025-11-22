import { GraphQLClient, gql } from 'graphql-request'
import { useState } from 'preact/hooks'

type Props = {
  backendBase: string
}

const REQUEST_QUERY = gql`
  query FindRequest($reqNumber: String!, $pin: String!) {
    Requests(where: { reqNumber: { equals: $reqNumber }, pin: { equals: $pin } }) {
      docs {
        id
        reqNumber
        applicantName
        status
        submittedAt
        notes
      }
    }
  }
`

export default function RequestLookup({ backendBase }: Props) {
  const [reqNumber, setReqNumber] = useState('')
  const [pin, setPin] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const graphqlClient = new GraphQLClient(`${backendBase}/api/graphql`)

  const onSubmit = async (event: Event) => {
    event.preventDefault()
    const nextErrors: string[] = []
    if (!reqNumber.trim()) nextErrors.push('Въведете номер на молба')
    if (!pin.trim()) nextErrors.push('Въведете ПИН')
    setErrors(nextErrors)
    if (nextErrors.length) return

    setLoading(true)
    try {
      const data = await graphqlClient.request(REQUEST_QUERY, { reqNumber, pin })
      console.log('Request lookup result:', data)
      setErrors([])
    } catch (err) {
      console.error('Request lookup failed:', err)
      setErrors(['Неуспешна проверка. Опитайте отново.'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div class="validation-summary-errors text-danger" aria-live="polite">
        <ul>
          {errors.length > 0 ? (
            errors.map((msg) => <li>{msg}</li>)
          ) : (
            <li class="text-muted">Попълнете формата и натиснете "Провери".</li>
          )}
        </ul>
      </div>

      <form onSubmit={onSubmit}>
        <div class="row">
          <div class="col-xs-12 col-sm-4">
            <div class="well">
              <div class="form-group">
                <label for="reqNum" class="control-label">
                  Молба вх.номер
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="reqNum"
                  name="reqNum"
                  value={reqNumber}
                  onInput={(e) => setReqNumber((e.target as HTMLInputElement).value)}
                  required
                  title="Моля въведете Вашият входящ номер"
                  placeholder=""
                />
                <span class="help-block"></span>
              </div>
              <div class="form-group">
                <label for="pin" class="control-label">
                  ПИН
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="pin"
                  name="pin"
                  value={pin}
                  onInput={(e) => setPin((e.target as HTMLInputElement).value)}
                  required
                  title="Моля въведете Вашият входящ ПИН"
                />
                <span class="help-block"></span>
              </div>
              <button type="submit" class="btn btn-brown" disabled={loading}>
                {loading ? 'Проверява...' : 'Провери'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
