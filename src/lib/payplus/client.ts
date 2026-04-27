const PAYPLUS_API_URL = "https://restapi.payplus.co.il/api/v1.0";

interface PayPlusPaymentPageParams {
  amount: number; // in agorot
  currency: string;
  description: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  more_info: string;
  success_url: string;
  failure_url: string;
  cancel_url: string;
  callback_url: string;
  charge_method?: number;
}

interface PayPlusGenerateLinkResponse {
  results: { status: string; code: number; description: string };
  data: { page_request_uid: string; payment_page_link: string };
}

export interface PayPlusTransaction {
  uid?: string;
  transaction_uid?: string;
  status_code?: string;
  amount?: number | string;
  currency_code?: string;
  type?: string;
  recurring_id?: string | null;
  more_info?: string;
}

interface PayPlusIpnResponse {
  results: { status: string; code: number; description: string };
  data?: {
    transaction?: PayPlusTransaction;
  } & PayPlusTransaction;
}

function getCreds() {
  const apiKey = process.env.PAYPLUS_API_KEY;
  const secretKey = process.env.PAYPLUS_SECRET_KEY;
  if (!apiKey || !secretKey) {
    throw new Error("PayPlus credentials not configured");
  }
  return { apiKey, secretKey };
}

async function payPlusFetch<T>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<T> {
  const { apiKey, secretKey } = getCreds();

  const res = await fetch(`${PAYPLUS_API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.stringify({
        api_key: apiKey,
        secret_key: secretKey,
      }),
      "api-key": apiKey,
      "secret-key": secretKey,
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as T & {
    results?: { status: string; description?: string };
  };

  if (!res.ok || json.results?.status !== "success") {
    throw new Error(
      `PayPlus API error: ${res.status} ${
        json.results?.description || "unknown"
      }`
    );
  }

  return json as T;
}

export async function createPaymentPage(
  params: PayPlusPaymentPageParams
): Promise<{ pageUrl: string; pageUid: string }> {
  const amountShekels = params.amount / 100;

  const response = await payPlusFetch<PayPlusGenerateLinkResponse>(
    "/PaymentPages/generateLink",
    {
      payment_page_uid: process.env.PAYPLUS_PAYMENT_PAGE_UID,
      amount: amountShekels,
      currency_code: params.currency,
      language_code: "he",
      more_info: params.more_info,
      customer: {
        customer_name: params.customer.name,
        email: params.customer.email,
        phone: params.customer.phone || undefined,
      },
      items: [
        {
          name: params.description,
          quantity: 1,
          price: amountShekels,
          vat_type: 0,
        },
      ],
      sendEmailApproval: true,
      sendEmailFailure: false,
      charge_method: params.charge_method ?? 1,
      ...(params.charge_method === 2 && {
        recurring_payments: {
          initial_price: amountShekels,
          ongoing_price: amountShekels,
          recurring_period: "monthly",
        },
      }),
      refURL_success: params.success_url,
      refURL_failure: params.failure_url,
      refURL_cancel: params.cancel_url,
      refURL_callback: params.callback_url,
    }
  );

  return {
    pageUrl: response.data.payment_page_link,
    pageUid: response.data.page_request_uid,
  };
}

// Look up the latest transaction for a payment page request UID. This is the
// authenticated trust anchor — we only believe a payment is real if PayPlus
// itself confirms it through this call (webhook bodies are untrusted).
export async function fetchTransactionByPageRequestUid(
  pageRequestUid: string
): Promise<PayPlusTransaction | null> {
  try {
    const response = await payPlusFetch<PayPlusIpnResponse>(
      "/PaymentPages/ipn",
      { payment_request_uid: pageRequestUid }
    );

    const data = response.data;
    if (!data) {
      console.error(
        "PayPlus IPN: missing data field",
        JSON.stringify(response).slice(0, 500)
      );
      return null;
    }

    // PayPlus has returned both shapes historically — handle both.
    if (data.transaction) return data.transaction;
    if (data.status_code) return data as PayPlusTransaction;

    console.error(
      "PayPlus IPN: unrecognized response shape",
      JSON.stringify(data).slice(0, 500)
    );
    return null;
  } catch (e) {
    console.error("PayPlus IPN lookup threw:", e);
    return null;
  }
}
