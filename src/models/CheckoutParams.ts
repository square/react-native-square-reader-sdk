import AmountMoney from "./AmountMoney";
import TipSettings from "./TipSettings";

interface CheckoutParams {
    amountMoney: AmountMoney;

    prepaidType?: string;

    skipReceipt?: boolean;

    collectSignature?: boolean;

    allowSplitTender?: boolean;

    delayCapture?: boolean;

    note?: string;
    
    tipSettings:TipSettings;

    additionalPaymentTypes?: string[];
}
export default CheckoutParams;