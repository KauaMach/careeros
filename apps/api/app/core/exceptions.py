class AppException(Exception):
    def __init__(self, message: str, status_code: int = 400, errors: list | None = None):
        self.message = message
        self.status_code = status_code
        self.errors = errors or []

class NotFoundException(AppException):
    def __init__(self, message: str = "Not Found", errors: list | None = None):
        super().__init__(message, 404, errors)

class UnauthorizedException(AppException):
    def __init__(self, message: str = "Unauthorized", errors: list | None = None):
        super().__init__(message, 401, errors)
