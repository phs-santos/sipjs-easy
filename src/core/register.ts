import { UserAgent, Registerer } from "sip.js";
import type { SipCredentials, SipRegisterResult } from "./types";

export async function register({
    domain,
    phone,
    secret,
    nameexten,
    server,
    userAgentString = "sipjs-simple",
}: SipCredentials): Promise<SipRegisterResult> {
    const uri = UserAgent.makeURI(`sip:${phone}@${domain}`);
    if (!uri) throw new Error("Invalid SIP URI");

    const userAgent = new UserAgent({
        displayName: nameexten ?? phone,
        authorizationUsername: phone,
        authorizationPassword: secret,
        uri,
        transportOptions: { server, traceSip: true },
        userAgentString,
        logLevel: "error",
    });

    await userAgent.start();

    const registerer = new Registerer(userAgent, {
        expires: 3600,
        extraHeaders: ["Organization: @phs-santos"],
    });

    await registerer.register();

    return { userAgent, registerer };
}
