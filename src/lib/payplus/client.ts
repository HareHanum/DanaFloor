const PAYPLUS_API_URL = "https://restapiapp.payplus.co.il/api/v1.0";

interface PayPlusPaymentPageParams {
  amount: number; // in agorot
  currency: string;
  description: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  more_info: string; // JSON string with our metadata
  success_url: string;
  failure_url: string;
  cancel_url: string;
  charge_method?: number; // 1 = one-time, 2 = recurring
}

interface PayPlusResponse {
  results: {
    status: string;
    code: number;
    description: string;
  };
  data: {
    page_request_uid: string;
    payment_page_link: string;
  };
}

async function payPlusFetch(
  endpoint: string,
  body: Record<string, unknown>
): Promise<PayPlusResponse> {
  const res = await fetch(`${PAYPLUS_API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.stringify({
        api_key: process.env.PAYPLUS_API_KEY!,
        secret_key: process.env.PAYPLUS_SECRET_KEY!,
      }),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`PayPlus API error: ${res.status}`);
  }

  return res.json();
}

export async function createPaymentPage(
  params: PayPlusPaymentPageParams
): Promise<{ pageUrl: string; pageUid: string }> {
  const response = await payPlusFetch("/PaymentPages/generateLink", {
    payment_page_uid: process.env.PAYPLUS_PAYMENT_PAGE_UID,
    amount: params.amount / 100, // PayPlus expects shekels, not agorot
    currency_code: params.currency,
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
        price: params.amount / 100,
        vat_type: 0, // inclusive
      },
    ],
    sendEmailApproval: true,
    sendEmailFailure: false,
    charge_method: params.charge_method ?? 1,
    ...(params.charge_method === 2 && {
      recurring_payments: {
        initial_price: params.amount / 100,
        ongoing_price: params.amount / 100,
        recurring_period: "monthly",
      },
    }),
    success_page_url: params.success_url,
    failure_page_url: params.failure_url,
    cancel_url: params.cancel_url,
  });

  return {
    pageUrl: response.data.payment_page_link,
    pageUid: response.data.page_request_uid,
  };
}
