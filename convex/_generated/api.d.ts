/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as Fetchall from "../Fetchall.js";
import type * as deleteTicket from "../deleteTicket.js";
import type * as getMyTickets from "../getMyTickets.js";
import type * as ticket from "../ticket.js";
import type * as updateStatus from "../updateStatus.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  Fetchall: typeof Fetchall;
  deleteTicket: typeof deleteTicket;
  getMyTickets: typeof getMyTickets;
  ticket: typeof ticket;
  updateStatus: typeof updateStatus;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
