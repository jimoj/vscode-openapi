import { Webapp as App } from "../message";
import {
  RunScanMessage,
  ScanOperationMessage,
  ShowScanReportMessage,
  ShowJsonPointerMessage,
} from "../scan";
import { LoadPreferencesMessage, SavePreferencesMessage } from "../prefs";
import { LoadEnvMessage, ShowEnvWindow } from "../env";
import { ChangeThemeMessage } from "../theme";
import { ShowGeneralErrorMessage } from "../error";
import {
  SendHttpRequestMessage,
  SendCurlRequestMessage,
  ShowHttpResponseMessage,
  ShowHttpErrorMessage,
} from "../http";

export type Webapp = App<
  // consumes
  | ScanOperationMessage
  | ShowGeneralErrorMessage
  | LoadEnvMessage
  | LoadPreferencesMessage
  | ChangeThemeMessage
  | ShowHttpErrorMessage
  | ShowScanReportMessage
  | ShowHttpResponseMessage,
  // produces
  | RunScanMessage
  | ShowEnvWindow
  | SavePreferencesMessage
  | SendHttpRequestMessage
  | SendCurlRequestMessage
  | ShowJsonPointerMessage
>;
