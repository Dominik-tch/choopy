package com.taschion.choopy.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Helper method to keep responses consistent and reduce boilerplate
    private Map<String, Object> buildErrorResponse(HttpStatus status, String error, String message) {
        return Map.of(
                "timestamp", LocalDateTime.now(),
                "status", status.value(),
                "error", error,
                "message", message
        );
    }

    // 1. Authentication Errors (Wrong password or username)
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException ex) {
        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.UNAUTHORIZED, "Unauthorized", "Invalid username or password."),
                HttpStatus.UNAUTHORIZED
        );
    }

    // 2. Authorization Errors (Not a member of the household, etc.)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.FORBIDDEN, "Forbidden", ex.getMessage()),
                HttpStatus.FORBIDDEN
        );
    }

    // 3. Duplicate Data Errors (e.g., trying to register an existing username)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        // You can parse the exact cause if needed, but a generic message is safer for security
        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.CONFLICT, "Conflict", "A record with this information already exists (e.g., username or email)."),
                HttpStatus.CONFLICT
        );
    }

    // 4. State Errors (e.g., "Task already completed" from TaskService)
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalState(IllegalStateException ex) {
        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage()),
                HttpStatus.BAD_REQUEST
        );
    }

    // 5. Missing Entities (.orElseThrow() triggers this by default)
    @ExceptionHandler({
            NoSuchElementException.class,
            TaskNotFoundException.class,
            MembershipNotFoundException.class,
            UsernameNotFoundException.class
    })
    public ResponseEntity<Map<String, Object>> handleNotFoundExceptions(Exception ex) {
        String message = ex instanceof NoSuchElementException ? "The requested resource was not found." : ex.getMessage();
        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.NOT_FOUND, "Not Found", message),
                HttpStatus.NOT_FOUND
        );
    }

    // 6. Bad Input (Malformed JSON from frontend)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleBadInput(HttpMessageNotReadableException ex) {
        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.BAD_REQUEST, "Bad Request", "The provided request body is invalid or malformed."),
                HttpStatus.BAD_REQUEST
        );
    }

    // 7. Catch-All for unhandled server errors
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralExceptions(Exception ex) {
        // Avoid exposing internal stack traces to the frontend in production
        return new ResponseEntity<>(
                buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", "An unexpected error occurred. Please try again later."),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}