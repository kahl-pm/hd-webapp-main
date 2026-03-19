import { PM_PRODUCT_PREFIX } from '@policyme/global-libjs-utils';
import { UserType } from '../../utils/const';

export const GET_PRICING_ELEMENTS_IDS_FOR_REPORTING = (
  product_type: typeof PM_PRODUCT_PREFIX[keyof typeof PM_PRODUCT_PREFIX],
) => {
  const paymentPagePriceSummaryFields = {
    /**
     * Element ID for the field displaying the CAA discount savings amount.
     * This represents the dollar amount that will be subtracted from the total quote
     * when a CAA member discount is applied to the user's policy.
     */
    CAA_DISCOUNT_SAVINGS_APPLIED_FIELD_ID: `caa_discount_savings_applied`,

    /**
     * Element ID for the field displaying the family discount savings amount.
     * This represents the dollar amount that will be subtracted from the total quote
     * when a CAA family discount is applied to the user's policy.
     */
    FAMILY_DISCOUNT_SAVINGS_APPLIED_FIELD_ID: `family_discount_savings_applied`,

    /**
     * Element ID for the field displaying the joint discount savings amount.
     * This represents the dollar amount that will be subtracted from the total quote
     * when a joint discount is applied to the user's policy.
     */
    JOINT_DISCOUNT_SAVINGS_APPLIED_FIELD_ID: `joint_discount_savings_applied`,

    /**
     * Element ID for the field displaying the exclusive perk discount savings amount.
     * Currently in the UI, this is shown to the user as 'FREE'. It represents the dollar amount
     * that user will PAY when an exclusive perk discount is applied to the user's policy.
     * It is usually applied for two months.
     */
    EXCLUSIVE_PERK_DISCOUNT_SAVINGS_APPLIED_FIELD_ID: `exclusive_perk_discount_savings_applied`,

    /**
     * Element ID for the field displaying the September TL discount savings amount.
     * This represents the dollar amount that will be subtracted from the total quote
     * when a September TL discount is applied to the user's policy.
     */
    PM_SEPT2025_TL_PROMO_SAVINGS_APPLIED_FIELD_ID: `pm_sept2025_tl_promo_savings_applied`,

    /**
     * Element ID for the field displaying the total monthly non-discounted price.
     * This represents the total monthly price of the policy before any discounts if applicable.
     */
    TOTAL_MONTHLY_NON_DISCOUNTED_PRICE_FIELD_ID: `${product_type}_total_monthly_non_discounted_price`,
  };

  return paymentPagePriceSummaryFields;
};
