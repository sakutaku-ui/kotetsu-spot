import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    // 環境変数の確認
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log('=== API UPDATE DEBUG ===')
    console.log('URL:', supabaseUrl ? '✓' : '✗')
    console.log('Key:', supabaseKey ? '✓' : '✗')

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' }, 
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { id, status } = await request.json()

    console.log('Request data:', { id, status })

    const { data, error } = await supabase
      .from('spots')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Update success:', data)
    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    )
  }
}