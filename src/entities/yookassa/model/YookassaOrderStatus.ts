export interface YookassaOrderStatus {
  type: string
  event: string
  object: Object
}

export interface Object {
  id: string
  status: string
  amount: Amount
  income_amount: IncomeAmount
  description: string
  recipient: Recipient
  payment_method: PaymentMethod
  captured_at: string
  created_at: string
  test: boolean
  refunded_amount: RefundedAmount
  paid: boolean
  refundable: boolean
  metadata: Metadata
}

export interface Amount {
  value: string
  currency: string
}

export interface IncomeAmount {
  value: string
  currency: string
}

export interface Recipient {
  account_id: string
  gateway_id: string
}

export interface PaymentMethod {
  type: string
  id: string
  saved: boolean
  status: string
  title: string
  account_number: string
}

export interface RefundedAmount {
  value: string
  currency: string
}

export interface Metadata {
  order_id: string
}
