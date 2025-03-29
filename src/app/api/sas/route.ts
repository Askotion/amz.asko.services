// src/app/api/sas/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// OPTIONS-Handler für Preflight-Anfragen
export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Mappe die eingehenden JSON-Daten zu den entsprechenden Feldern.
    const asin = body.ASIN;
    const quantity = parseInt(body.Quantity, 10);
    const cost_price = parseFloat(body.CostPrice);
    const sale_price = parseFloat(body.SalePrice);
    const vat_on_cost = body["VAT_on_Cost"] === "Yes"; // Achte hier auf den korrekten Schlüssel!
    const estimated_sales = body.EstimatedSales;

    // Überprüfen, ob die ASIN bereits existiert.
    const { data: existingRecord, error: selectError } = await supabase
      .from('amz_sas_purchase')
      .select('asin')
      .eq('asin', asin)
      .limit(1)
      .maybeSingle();

    if (selectError) {
      console.error('Error checking for existing ASIN:', selectError);
      return new Response(JSON.stringify({ error: selectError.message }), {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    if (existingRecord) {
      // ASIN existiert bereits, also keine Duplikate einfügen.
      return new Response(
        JSON.stringify({ message: 'ASIN already exists. Row not inserted.' }),
        { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Füge den neuen Datensatz ein. (Die "id"-Spalte wird automatisch generiert.)
    const { data, error } = await supabase
      .from('amz_sas_purchase')
      .insert([
        {
          asin,
          quantity,
          cost_price,
          sale_price,
          vat_on_cost,
          estimated_sales,
        },
      ]);

    if (error) {
      console.error('Error inserting new record:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  } catch (err: any) {
    console.error('Error processing request:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}
