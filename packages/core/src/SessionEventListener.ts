//
// Copyright Inrupt Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
// Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
import type { EventEmitter } from "events";
import type { EVENTS } from "./constant";
import type { KeyPair } from "./authenticatedFetch/dpopUtils";

export interface IHasSessionEventListener {
  events: ISessionEventListener;
}

/**
 * The state preserved during an authorization request and sent to the client
 */
export type AuthorizationRequestState = {
  /**
   * The code verifier used to generate the authorization code.
   */
  codeVerifier: string;

  /**
   * The state parameter used to generate the authorization code.
   */
  state: string;

  /**
   * The user's identity provider.
   */
  issuer: string;

  /**
   * The redirect URL to which the user will be redirected after the authorization code has been received.
   */
  redirectUrl: string;

  /**
   * True if a DPoP compatible auth_token should be requested.
   */
  dpopBound: boolean;

  /**
   * The ID of your application.
   */
  clientId: string;
};

/**
 * A set of tokens to be passed to the client
 */
export type SessionTokenSet = {
  /**
   * JWT-serialized access token
   */
  accessToken?: string;
  /**
   * JWT-serialized ID token
   */
  idToken?: string;
  /**
   * URL identifying the subject of the ID token.
   */
  webId?: string;
  /**
   * Refresh token (not necessarily a JWT)
   */
  refreshToken?: string;
  /**
   * Expiration of the access token.
   */
  expiresAt?: number;
  /**
   * DPoP key to which the access token, and potentially the refresh token, are bound.
   */
  dpopKey?: KeyPair;
  /**
   * The user's identity provider.
   */
  issuer: string;
  /**
   * The ID of your application.
   */
  clientId: string;
};

// These types help preventing inconsistencies between on, once and off.
type LOGIN_ARGS = { eventName: typeof EVENTS.LOGIN; listener: () => void };
type LOGOUT_ARGS = { eventName: typeof EVENTS.LOGOUT; listener: () => void };
type SESSION_EXPIRED_ARGS = {
  eventName: typeof EVENTS.SESSION_EXPIRED;
  listener: () => void;
};
type SESSION_RESTORED_ARGS = {
  eventName: typeof EVENTS.SESSION_RESTORED;
  listener: (currentUrl: string) => unknown;
};
type ERROR_ARGS = {
  eventName: typeof EVENTS.ERROR;
  listener: (
    error: string | null,
    errorDescription?: string | Error | null,
  ) => unknown;
};
type SESSION_EXTENDED_ARGS = {
  eventName: typeof EVENTS.SESSION_EXTENDED;
  listener: (expiresIn: number) => void;
};
type TIMEOUT_SET_ARGS = {
  eventName: typeof EVENTS.TIMEOUT_SET;
  listener: (timeoutId: number) => void;
};
/**
 * @deprecated Use NEW_TOKENS_ARGS instead
 */
type NEW_REFRESH_TOKEN_ARGS = {
  eventName: typeof EVENTS.NEW_REFRESH_TOKEN;
  listener: (newToken: string) => void;
};
type NEW_TOKENS_ARGS = {
  eventName: typeof EVENTS.NEW_TOKENS;
  listener: (tokenSet: SessionTokenSet) => void;
};
type AUTH_STATE_ARGS = {
  eventName: typeof EVENTS.AUTHORIZATION_REQUEST;
  listener: (authorizationRequestState: AuthorizationRequestState) => void;
};
type FALLBACK_ARGS = {
  eventName: Parameters<InstanceType<typeof EventEmitter>["on"]>[0];
  // Prevents from using a SessionEventEmitter as an arbitrary EventEmitter.
  listener: never;
};

export interface ISessionEventListener extends EventEmitter {
  /**
   * Register a listener called on successful login.
   * @param eventName The login event name
   * @param listener The callback called on successful login
   */
  on(
    eventName: LOGIN_ARGS["eventName"],
    listener: LOGIN_ARGS["listener"],
  ): this;
  /**
   * Register a listener called on successful logout.
   * @param eventName The logout event name.
   * @param listener The callback called on successful logout.
   */
  on(
    eventName: LOGOUT_ARGS["eventName"],
    listener: LOGOUT_ARGS["listener"],
  ): this;
  /**
   * Register a listener called on session expiration.
   * @param eventName The session expiration event name.
   * @param listener The callback called on session expiration.
   */
  on(
    eventName: SESSION_EXPIRED_ARGS["eventName"],
    listener: SESSION_EXPIRED_ARGS["listener"],
  ): this;
  /**
   * Register a listener called on session restoration after a silent login.
   * @param eventName The session restoration event name.
   * @param listener The callback called on successful session restore.
   */
  on(
    eventName: SESSION_RESTORED_ARGS["eventName"],
    listener: SESSION_RESTORED_ARGS["listener"],
  ): this;
  /**
   * Register a listener called on error, with an error identifier and description.
   * @param eventName The error event name.
   * @param listener The callback called on error.
   */
  on(
    eventName: ERROR_ARGS["eventName"],
    listener: ERROR_ARGS["listener"],
  ): this;
  /**
   * Register a listener called on session extension.
   * @param eventName The session extension event name.
   * @param listener The callback called on session extension.
   */
  on(
    eventName: SESSION_EXTENDED_ARGS["eventName"],
    listener: SESSION_EXTENDED_ARGS["listener"],
  ): this;
  /**
   * Register a listener called when a timeout is set for a session event with
   * the timeout handle.
   * @param eventName The timeout set event name.
   * @param listener The callback called when setting a timeout.
   */
  on(
    eventName: TIMEOUT_SET_ARGS["eventName"],
    listener: TIMEOUT_SET_ARGS["listener"],
  ): this;
  /**
   * Register a listener called when a new refresh token is issued for the session.
   * @param eventName The new refresh token issued event name.
   * @param listener The callback called when a new refresh token is issued.
   * @deprecated Use NEW_TOKENS event listeners instead
   */
  on(
    eventName: NEW_REFRESH_TOKEN_ARGS["eventName"],
    listener: NEW_REFRESH_TOKEN_ARGS["listener"],
  ): this;
  /**
   * Register a listener called when new tokens are issued for the session.
   * @param eventName The new tokens issued event name.
   * @param listener The callback called when new tokens are issued.
   */
  on(
    eventName: NEW_TOKENS_ARGS["eventName"],
    listener: NEW_TOKENS_ARGS["listener"],
  ): this;
  /**
   * Register a listener called when auth state information is available during authentication.
   * @param eventName The auth state event name.
   * @param listener The callback called when auth state information is available.
   */
  on(
    eventName: AUTH_STATE_ARGS["eventName"],
    listener: AUTH_STATE_ARGS["listener"],
  ): this;
  /**
   * @hidden This is a fallback constructor overriding the EventEmitter behavior.
   *  It shouldn't be in the API docs.
   */
  on(
    eventName: FALLBACK_ARGS["eventName"],
    listener: FALLBACK_ARGS["listener"],
  ): this;

  /**
   * Register a listener called on successful login.
   * @param eventName The login event name
   * @param listener The callback called on successful login
   */
  addListener(
    eventName: LOGIN_ARGS["eventName"],
    listener: LOGIN_ARGS["listener"],
  ): this;
  /**
   * Register a listener called on successful logout.
   * @param eventName The logout event name.
   * @param listener The callback called on successful logout.
   */
  addListener(
    eventName: LOGOUT_ARGS["eventName"],
    listener: LOGOUT_ARGS["listener"],
  ): this;
  /**
   * Register a listener called on session expiration.
   * @param eventName The session expiration event name.
   * @param listener The callback called on session expiration.
   */
  addListener(
    eventName: SESSION_EXPIRED_ARGS["eventName"],
    listener: SESSION_EXPIRED_ARGS["listener"],
  ): this;
  /**
   * Register a listener called on session restoration after a silent login.
   * @param eventName The session restoration event name.
   * @param listener The callback called on successful session restore.
   */
  addListener(
    eventName: SESSION_RESTORED_ARGS["eventName"],
    listener: SESSION_RESTORED_ARGS["listener"],
  ): this;
  /**
   * Register a listener called on error, with an error identifier and description.
   * @param eventName The error event name.
   * @param listener The callback called on error.
   */
  addListener(
    eventName: ERROR_ARGS["eventName"],
    listener: ERROR_ARGS["listener"],
  ): this;
  /**
   * Register a listener called on session extension.
   * @param eventName The session extension event name.
   * @param listener The callback called on session extension.
   */
  addListener(
    eventName: SESSION_EXTENDED_ARGS["eventName"],
    listener: SESSION_EXTENDED_ARGS["listener"],
  ): this;
  /**
   * Register a listener called when a timeout is set for a session event with
   * the timeout handle.
   * @param eventName The timeout set event name.
   * @param listener The callback called when setting a timeout.
   */
  addListener(
    eventName: TIMEOUT_SET_ARGS["eventName"],
    listener: TIMEOUT_SET_ARGS["listener"],
  ): this;
  /**
   * Register a listener called when a new refresh token is issued for the session.
   * @param eventName The new refresh token issued event name.
   * @param listener The callback called when a new refresh token is issued.
   * @deprecated Use NEW_TOKENS event listeners instead
   */
  addListener(
    eventName: NEW_REFRESH_TOKEN_ARGS["eventName"],
    listener: NEW_REFRESH_TOKEN_ARGS["listener"],
  ): this;
  /**
   * Register a listener called when new tokens are issued for the session.
   * @param eventName The new tokens issued event name.
   * @param listener The callback called when new tokens are issued.
   */
  addListener(
    eventName: NEW_TOKENS_ARGS["eventName"],
    listener: NEW_TOKENS_ARGS["listener"],
  ): this;
  /**
   * Register a listener called when auth state information is available during authentication.
   * @param eventName The auth state event name.
   * @param listener The callback called when auth state information is available.
   */
  addListener(
    eventName: AUTH_STATE_ARGS["eventName"],
    listener: AUTH_STATE_ARGS["listener"],
  ): this;
  /**
   * @hidden This is a fallback constructor overriding the EventEmitter behavior.
   *  It shouldn't be in the API docs.
   */
  addListener(
    eventName: FALLBACK_ARGS["eventName"],
    listener: FALLBACK_ARGS["listener"],
  ): this;

  /**
   * Register a listener called on the next successful login with the logged in WebID.
   * @param eventName The login event name.
   * @param listener The callback called on the next successful login.
   */
  once(
    eventName: LOGIN_ARGS["eventName"],
    listener: LOGIN_ARGS["listener"],
  ): this;
  /**
   * Register a listener called on the next successful logout.
   * @param eventName The logout event name.
   * @param listener The callback called on the next successful logout.
   */
  once(
    eventName: LOGOUT_ARGS["eventName"],
    listener: LOGOUT_ARGS["listener"],
  ): this;
  /**
   * Register a listener called on the next session expiration.
   * @param eventName The session expiration event name.
   * @param listener The callback called on the next session expiration.
   */
  once(
    eventName: SESSION_EXPIRED_ARGS["eventName"],
    listener: SESSION_EXPIRED_ARGS["listener"],
  ): this;
  /**
   * Register a listener called on the next session restoration after a silent login.
   * @param eventName The session restoration event name.
   * @param listener The callback called on the next successful session restore.
   */
  once(
    eventName: SESSION_RESTORED_ARGS["eventName"],
    listener: SESSION_RESTORED_ARGS["listener"],
  ): this;
  /**
   * Register a listener called on the next error, with an error identifier and description.
   * @param eventName The error event name.
   * @param listener The callback called on the next error.
   */
  once(
    eventName: ERROR_ARGS["eventName"],
    listener: ERROR_ARGS["listener"],
  ): this;
  /**
   * Register a listener called on the next session extension.
   * @param eventName The session extension event name.
   * @param listener The callback called on the next session extension.
   */
  once(
    eventName: SESSION_EXTENDED_ARGS["eventName"],
    listener: SESSION_EXTENDED_ARGS["listener"],
  ): this;
  /**
   * Register a listener called the next time a timeout is set for a session event
   * with the timeout handle.
   * @param eventName The timeout set event name.
   * @param listener The callback called when next setting a timeout.
   */
  once(
    eventName: TIMEOUT_SET_ARGS["eventName"],
    listener: TIMEOUT_SET_ARGS["listener"],
  ): this;
  /**
   * Register a listener called the next time a new refresh token is issued for
   * the session.
   * @param eventName The new refresh token issued event name.
   * @param listener The callback called next time a new refresh token is issued.
   * @deprecated Use NEW_TOKENS event listeners instead
   */
  once(
    eventName: NEW_REFRESH_TOKEN_ARGS["eventName"],
    listener: NEW_REFRESH_TOKEN_ARGS["listener"],
  ): this;
  /**
   * Register a listener called the next time new tokens are issued for
   * the session.
   * @param eventName The new tokens issued event name.
   * @param listener The callback called next time new tokens are issued.
   * @since 2.4.0
   */
  once(
    eventName: NEW_TOKENS_ARGS["eventName"],
    listener: NEW_TOKENS_ARGS["listener"],
  ): this;
  /**
   * Register a listener called the next time auth state information is available during authentication.
   * @param eventName The auth state event name.
   * @param listener The callback called next time auth state information is available.
   */
  once(
    eventName: AUTH_STATE_ARGS["eventName"],
    listener: AUTH_STATE_ARGS["listener"],
  ): this;
  /**
   * @hidden This is a fallback constructor overriding the EventEmitter behavior.
   *  It shouldn't be in the API docs.
   */
  once(
    eventName: FALLBACK_ARGS["eventName"],
    listener: FALLBACK_ARGS["listener"],
  ): this;

  /**
   * Unegister a listener called on successful login with the logged in WebID.
   * @param eventName The login event name.
   * @param listener The callback to unregister.
   */
  off(
    eventName: LOGIN_ARGS["eventName"],
    listener: LOGIN_ARGS["listener"],
  ): this;
  /**
   * Unegister a listener called on successful logout.
   * @param eventName The logout event name.
   * @param listener The callback to unregister.
   */
  off(
    eventName: LOGOUT_ARGS["eventName"],
    listener: LOGOUT_ARGS["listener"],
  ): this;
  /**
   * Unegister a listener called on session expiration.
   * @param eventName The session expiration event name.
   * @param listener The callback to unregister.
   */
  off(
    eventName: SESSION_EXPIRED_ARGS["eventName"],
    listener: SESSION_EXPIRED_ARGS["listener"],
  ): this;
  /**
   * Unegister a listener called on session restoration after a silent login.
   * @param eventName The session restoration event name.
   * @param listener The callback to unregister.
   */
  off(
    eventName: SESSION_RESTORED_ARGS["eventName"],
    listener: SESSION_RESTORED_ARGS["listener"],
  ): this;
  /**
   * Unegister a listener called on error, with an error identifier and description.
   * @param eventName The error event name.
   * @param listener The callback to unregister.
   */
  off(
    eventName: ERROR_ARGS["eventName"],
    listener: ERROR_ARGS["listener"],
  ): this;
  /**
   * Unegister a listener called on session extension.
   * @param eventName The session extension event name.
   * @param listener The callback to unregister.
   */
  off(
    eventName: SESSION_EXTENDED_ARGS["eventName"],
    listener: SESSION_EXTENDED_ARGS["listener"],
  ): this;
  /**
   * Unegister a listener called when a timeout is set for a session event.
   * @param eventName The timeout set event name.
   * @param listener The callback called when next setting a timeout.
   */
  off(
    eventName: TIMEOUT_SET_ARGS["eventName"],
    listener: TIMEOUT_SET_ARGS["listener"],
  ): this;
  /**
   * Unegister a listener called when a new refresh token is issued.
   * @param eventName The new refresh token issued event name.
   * @param listener The callback called next time a new refresh token is issued.
   * @deprecated Use NEW_TOKENS event listeners instead
   */
  off(
    eventName: NEW_REFRESH_TOKEN_ARGS["eventName"],
    listener: NEW_REFRESH_TOKEN_ARGS["listener"],
  ): this;
  /**
   * Unegister a listener called when new tokens are issued.
   * @param eventName The new tokens issued event name.
   * @param listener The callback called next time new tokens are issued.
   */
  off(
    eventName: NEW_TOKENS_ARGS["eventName"],
    listener: NEW_TOKENS_ARGS["listener"],
  ): this;
  /**
   * Unregister a listener called when auth state information is available.
   * @param eventName The auth state event name.
   * @param listener The callback to unregister.
   */
  off(
    eventName: AUTH_STATE_ARGS["eventName"],
    listener: AUTH_STATE_ARGS["listener"],
  ): this;
  /**
   * @hidden This is a fallback constructor overriding the EventEmitter behavior.
   *  It shouldn't be in the API docs.
   */
  off(
    eventName: FALLBACK_ARGS["eventName"],
    listener: FALLBACK_ARGS["listener"],
  ): this;

  /**
   * Unegister a listener called on successful login with the logged in WebID.
   * @param eventName The login event name.
   * @param listener The callback to unregister.
   */
  removeListener(
    eventName: LOGIN_ARGS["eventName"],
    listener: LOGIN_ARGS["listener"],
  ): this;
  /**
   * Unegister a listener called on successful logout.
   * @param eventName The logout event name.
   * @param listener The callback to unregister.
   */
  removeListener(
    eventName: LOGOUT_ARGS["eventName"],
    listener: LOGOUT_ARGS["listener"],
  ): this;
  /**
   * Unegister a listener called on session expiration.
   * @param eventName The session expiration event name.
   * @param listener The callback to unregister.
   */
  removeListener(
    eventName: SESSION_EXPIRED_ARGS["eventName"],
    listener: SESSION_EXPIRED_ARGS["listener"],
  ): this;
  /**
   * Unegister a listener called on session restoration after a silent login.
   * @param eventName The session restoration event name.
   * @param listener The callback to unregister.
   */
  removeListener(
    eventName: SESSION_RESTORED_ARGS["eventName"],
    listener: SESSION_RESTORED_ARGS["listener"],
  ): this;
  /**
   * Unegister a listener called on error, with an error identifier and description.
   * @param eventName The error event name.
   * @param listener The callback to unregister.
   */
  removeListener(
    eventName: ERROR_ARGS["eventName"],
    listener: ERROR_ARGS["listener"],
  ): this;
  /**
   * Unegister a listener called on session extension.
   * @param eventName The session extension event name.
   * @param listener The callback to unregister.
   */
  removeListener(
    eventName: SESSION_EXTENDED_ARGS["eventName"],
    listener: SESSION_EXTENDED_ARGS["listener"],
  ): this;
  /**
   * Unegister a listener called when a timeout is set for a session event.
   * @param eventName The timeout set event name.
   * @param listener The callback called when next setting a timeout.
   */
  removeListener(
    eventName: TIMEOUT_SET_ARGS["eventName"],
    listener: TIMEOUT_SET_ARGS["listener"],
  ): this;
  /**
   * Unegister a listener called when a new refresh token is issued.
   * @param eventName The new refresh token issued event name.
   * @param listener The callback called next time a new refresh token is issued.
   * @deprecated Use NEW_TOKENS event listeners instead
   */
  removeListener(
    eventName: NEW_REFRESH_TOKEN_ARGS["eventName"],
    listener: NEW_REFRESH_TOKEN_ARGS["listener"],
  ): this;
  /**
   * Unegister a listener called when new tokens are issued.
   * @param eventName The new tokens issued event name.
   * @param listener The callback called next time new tokens are issued.
   */
  removeListener(
    eventName: NEW_TOKENS_ARGS["eventName"],
    listener: NEW_TOKENS_ARGS["listener"],
  ): this;
  /**
   * Unregister a listener called when auth state information is available.
   * @param eventName The auth state event name.
   * @param listener The callback to unregister.
   */
  removeListener(
    eventName: AUTH_STATE_ARGS["eventName"],
    listener: AUTH_STATE_ARGS["listener"],
  ): this;
  /**
   * @hidden This is a fallback constructor overriding the EventEmitter behavior.
   *  It shouldn't be in the API docs.
   */
  removeListener(
    eventName: FALLBACK_ARGS["eventName"],
    listener: FALLBACK_ARGS["listener"],
  ): this;

  /**
   * @hidden This is a fallback overriding the EventEmitter behavior.
   *  It shouldn't be in the API docs.
   */
  emit(eventName: never, ...args: never): boolean;
}
