import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalid-param-error'

export class SignUpController implements Controller {

    private emailValidator: EmailValidator

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }

    handle(httpRequest: HttpRequest): HttpResponse {
        const requiredFilds = ['name', 'email', 'password', 'password', 'passwordConfirmation']
        for (const field of requiredFilds) {
            if (!httpRequest.body[field]) {
                return badRequest(new MissingParamError(field))
            }
        }

        if (!this.emailValidator.isValid(httpRequest.body.email)) {
            return badRequest(new InvalidParamError('email'))
        }

    }
}