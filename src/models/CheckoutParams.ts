import AmountMoney from "./AmountMoney";
import TipSettings from "./TipSettings";

interface CheckoutParams {
    brand?: string;

    expirationMonth?: number;

    expirationYear?: number;

    lastFourDigits?: string;

    postalCode?: string;

    prepaidType?: string;

    type?: string;

    amountMoney?: AmountMoney;

    skipReceipt?: boolean;

    collectSignature?: boolean;

    allowSplitTender?: boolean;

    delayCapture?: boolean;

    note?: string;
    
    tipSettings?:TipSettings;

    additionalPaymentTypes?: string[];
}
export default CheckoutParams;