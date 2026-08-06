export const getAccountName = (data: any): string => {
  if (!data) return "";
  return (
    data.accountName ||
    data.account_name ||
    data.businessName ||
    data.business_name ||
    data.profile?.businessName ||
    data.profile?.business_name ||
    data.name ||
    ""
  );
};
