import { SocialUser } from "angularx-social-login";

export class UserProfile {
    name: string;
    email: string;
    inst: string;
    status: string;
    isAdmin: boolean = false;
    isApiUser: boolean = false;

    constructor(userData?: SocialUser) {
        if (userData != null) {
            this.name = userData.name;
            this.email = userData.email;
        }
    }
}