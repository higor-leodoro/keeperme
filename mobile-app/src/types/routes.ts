import { CategoryEnum } from "./category";
import { Transaction, TransactionTypeEnum } from "./transaction";

export type RoutesParamsList = {
  HomeTabs: undefined;
  Home: undefined;
  TransactionsReport: undefined;
  Profile: undefined;
  SignIn: undefined;
  NewTransaction: { type: TransactionTypeEnum; category?: CategoryEnum };
  TransactionDetails: { transaction: Transaction };
};
