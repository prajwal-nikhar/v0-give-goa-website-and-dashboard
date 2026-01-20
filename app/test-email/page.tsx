'use client'

import { useState } from 'react'

export default function TestEmailPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const sendEmail = async () => {
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'user@example.com',
          subject: 'Test email',
          body: '<h1>Hello from Gmail</h1>',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send email')
      }

      setMessage('Email sent successfully')
    } catch (err: any) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <button onClick={sendEmail} disabled={loading}>
        {loading ? 'Sending…' : 'Send Test Email'}
      </button>

      {message && <p>{message}</p>}
    </div>
  )
}
