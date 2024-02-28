
import { Signup } from "../../api-status";
import { BaseCustomError } from "../base-custom-error";
import { SerializedErrorOutput } from "../type/serialized-error-output";

export class OTPInvalidNumberError extends BaseCustomError {
    private statusCode = 422; // 410 Gone might be appropriate for expired resources, or 400 Bad Request
    private defaultErrorMessage = Signup.OTP_INVALID_NUMBER;

    constructor() {
        super(Signup.OTP_INVALID_NUMBER);
        Object.setPrototypeOf(this, OTPInvalidNumberError.prototype);
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
