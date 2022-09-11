import fetch from 'node-fetch';
import { OFFICIAL_SERVER_ORIGIN } from '../../../constants/server';
import { UserConfig } from '../../../interfaces/user';
import { NormalUser } from './index';

export class NormalAccount {

    public readonly user: NormalUser;

    private _server?: string;
    private _name?: string;
    private _avatar?: string;
    private _email?: string;
    private _token?: string;

    public constructor(user: NormalUser, config: UserConfig) {
        this.user = user;

        console.log(user.settings.config.account, config.account);
        if (config.account) {
            this._server = config.account.server ?? undefined;
            this._email = config.account.email;
            this._token = config.account.token;

            fetch(
                `${this._server ?? OFFICIAL_SERVER_ORIGIN}/profile`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this._token}`
                    }
                }
            ).then((res) => res.json()).then((data: any) => {
                this._name = data.name;
                this._avatar = data.avatar;
                this._email = data.email;

                console.log(`${user.id}: Logged is ${this._name} (${this._email})`);
            }).catch((reason) => console.error(reason));
        } else {

        }
    }

    public get server() {
        return this._server;
    }

    public get name() {
        return this._name;
    }

    public get avatar() {
        return this._avatar;
    }

    public get email() {
        return this._email;
    }


    public async register(name: string, email: string, password: string, server?: string) {
        const res = await fetch(
            `${server ?? OFFICIAL_SERVER_ORIGIN}/user`,
            {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            }
        );
        const data: any = await res.json();

        this._server = server ?? OFFICIAL_SERVER_ORIGIN;
        this._name = data.name;
        this._avatar = data.avatar;
        this._email = data.email;

        this.user.settings.config = {
            account: {
                server: server ?? null,
                email: data.email,
                token: data.token
            }
        };
    }

    public async login(email: string, password: string, server?: string) {
        const res = await fetch(
            `${server ?? OFFICIAL_SERVER_ORIGIN}/user`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            }
        );
        const data: any = await res.json();

        this._server = server ?? OFFICIAL_SERVER_ORIGIN;
        this._name = data.name;
        this._avatar = data.avatar;
        this._email = data.email;

        this.user.settings.config = {
            account: {
                server: server ?? null,
                email: data.email,
                token: data.token
            }
        };
    }

    public async logout() {
        const res = await fetch(
            `${this._server ?? OFFICIAL_SERVER_ORIGIN}/token`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this._token}`
                }
            }
        );

        if (res.ok) {
            this._server = undefined;
            this._name = undefined;
            this._avatar = undefined;
            this._email = undefined;
            this.user.settings.config = { account: null };
        }

        return res.ok;
    }

}
