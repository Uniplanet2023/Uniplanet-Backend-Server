import { SignIn } from "../../api-status/signin";
import { BaseCustomError } from "../base-custom-error";
import { SerializedErrorOutput } from "../type/serialized-error-output";

export class TokenNotFoundError extends BaseCustomError {
    private statusCode = 404; // 404 Not Found might be used, or 401 Unauthorized, depending on context
    private defaultErrorMessage = SignIn.TOKEN_NOT_FOUND;

    constructor() {
        super(SignIn.TOKEN_NOT_FOUND);
        Object.setPrototypeOf(this, TokenNotFoundError.prototype);
    }

    getStatusCode(): number {
        return this.statusCode;
    }

    serializeErrorOutput(): SerializedErrorOutput {
        return {
            errors: [{ message: this.defaultErrorMessage }],
        };
    }
}