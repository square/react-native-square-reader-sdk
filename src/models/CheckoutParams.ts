import AmountMoney from "./AmountMoney";
import TipSettings from "./TipSettings";

interface CheckoutParams {
    amountMoney: AmountMoney;

    expirationYear?: number;

    lastFourDigits?: string;

    postalCode?: string;

    prepaidType?: string;

    skipReceipt?: boolean;

    collectSignature?: boolean;

    allowSplitTender?: boolean;

    delayCapture?: boolean;

    note?: string;
    
    tipSettings?:TipSettings;

    additionalPaymentTypes?: string[];
}
export default CheckoutParams;