import { Injectable, ArgumentMetadata, UnprocessableEntityException, ValidationPipe, BadRequestException } from '@nestjs/common';

interface ErrorResponse {
    message: string[];
    error: string;
    statusCode: number;
}

@Injectable()
export class ValidateInputPipe extends ValidationPipe {
    public async transform(value, metadata: ArgumentMetadata) {
        try {
            // console.log("hhhhhhhhhhhhhh")
            return await super.transform(value, metadata);
        } catch (e) {
            if (e instanceof BadRequestException) {
                // console.error("hhhhhhhhhhhhhh", e.getResponse()); // Log the full exception details for debugging
                const errorResponse = e.getResponse() as ErrorResponse;
                throw new UnprocessableEntityException(this.handleError(errorResponse));
            }
            throw e; // Re-throw the exception if it's not a BadRequestException
        }
    }

    private handleError(errorResponse: ErrorResponse) {
        const validationErrors = errorResponse.message;
        // console.log("ffffffffffffffffff", validationErrors);

        // Include the entire error object with the message property
        return {
            ...errorResponse,
            message: validationErrors,
        };
    }
}
