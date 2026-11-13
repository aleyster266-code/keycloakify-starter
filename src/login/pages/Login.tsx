import { useEffect } from "react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

type LoginProps = {
  kcContext: Extract<KcContext, { pageId: "login.ftl" }>;
  i18n: I18n;
  doUseDefaultCss?: boolean;
  classes?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Template: any;
};

// Colores del box de mensajes generales, según el tipo que manda Keycloak.
const ESTILOS_MENSAJE = {
  error: "bg-red-50 border-red-200 text-red-700",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  success: "bg-green-50 border-green-200 text-green-700",
  info: "bg-sky-50 border-sky-200 text-sky-800",
} as const;

export default function Login(props: LoginProps) {
  const { kcContext, i18n, Template, doUseDefaultCss = false } = props;
  const { url, login, realm, client, message, messagesPerField } = kcContext;
  const { msg, advancedMsgStr } = i18n;

  // Nombre de la app que pidió el login (Clients → <client> → Name en
  // Keycloak). Así un mismo tema sirve para SEPSA Consola, e-Cobro, etc.
  const nombreApp = client.name ? advancedMsgStr(client.name) : client.clientId;

  useEffect(() => {
    document.title = `Iniciar sesión · ${nombreApp}`;
  }, [nombreApp]);

  // Usuario o contraseña inválidos: Keycloak lo marca como error de campo
  // (ya traducido según el idioma del realm), no hace falta comparar textos.
  const errorCredenciales = messagesPerField.existsError("username", "password")
    ? messagesPerField.getFirstError("username", "password")
    : null;

  // Mensaje general (sesión expirada, cuenta deshabilitada, etc.), solo si
  // no es el mismo error de credenciales que ya se muestra arriba.
  const mensajeGeneral = !errorCredenciales && message ? message : null;

  const claseInput = (conError: boolean) =>
    `w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-1 ${
      conError
        ? "border-red-400 focus:ring-red-400 focus:border-red-400"
        : "border-border focus:ring-primary focus:border-primary"
    }`;

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      headerNode={null}
      displayMessage={false} // los mensajes se pintan dentro de la card
    >
      <div className="min-h-screen flex flex-col items-center justify-center bg-app-gradient px-4">
        {/* Logo — SEPSA */}
        <div className="inline-flex items-center font-bold text-4xl text-chrome mb-6">
          <span>SEPS</span>
          <span className="relative">
            A
            <span className="absolute -top-1.5 -right-1 w-2.5 h-2.5 rounded-full bg-primary" />
          </span>
        </div>

        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-lg font-semibold text-chrome text-center">Iniciar sesión</h1>
          <p className="text-sm font-medium text-chrome text-center mt-0.5">{nombreApp}</p>
          <p className="text-sm text-gray-500 text-center mt-2 mb-6">
            Ingresá con tu cuenta de SEPSA para continuar.
          </p>

          {errorCredenciales && (
            <div
              role="alert"
              className={`mb-4 px-4 py-2.5 rounded-lg border text-sm ${ESTILOS_MENSAJE.error}`}
            >
              {errorCredenciales}
            </div>
          )}

          {mensajeGeneral && (
            <div
              role={mensajeGeneral.type === "error" ? "alert" : "status"}
              className={`mb-4 px-4 py-2.5 rounded-lg border text-sm ${ESTILOS_MENSAJE[mensajeGeneral.type]}`}
            >
              {mensajeGeneral.summary}
            </div>
          )}

          <form id="kc-form-login" action={url.loginAction} method="post" className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs text-gray-500 mb-1.5">
                {realm.loginWithEmailAllowed ? msg("usernameOrEmail") : msg("username")}
              </label>
              <input
                id="username"
                name="username"
                defaultValue={login.username ?? ""}
                required
                autoFocus
                autoComplete="username"
                aria-invalid={!!errorCredenciales}
                className={claseInput(!!errorCredenciales)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs text-gray-500 mb-1.5">
                {msg("password")}
              </label>
              {/* Usa el ícono nativo del navegador para mostrar/ocultar */}
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                aria-invalid={!!errorCredenciales}
                className={claseInput(!!errorCredenciales)}
              />
            </div>

            <input type="hidden" name="credentialId" id="id-hidden-input" />

            <button
              type="submit"
              className="w-full h-10 rounded-pill bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {msg("doLogIn")}
            </button>
          </form>
        </div>
      </div>
    </Template>
  );
}
