import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController implements Controller {

    private emailValidator: EmailValidator

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }

    handle(httpRequest: HttpRequest): HttpResponse {
        try {
            const requiredFilds = ['name', 'email', 'password', 'password', 'passwordConfirmation']
            for (const field of requiredFilds) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }
            const isValid = this.emailValidator.isValid(httpRequest.body.email)
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }

        } catch (error) {
            return serverError()
        }
    }
}