// Simple math functions for WebAssembly demonstration
#include <emscripten.h>

// Export function to add two numbers
EMSCRIPTEN_KEEPALIVE
int add(int a, int b) {
    return a + b;
}

// Export function to multiply two numbers
EMSCRIPTEN_KEEPALIVE
int multiply(int a, int b) {
    return a * b;
}

// Export function to calculate factorial
EMSCRIPTEN_KEEPALIVE
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Export function to calculate Fibonacci number
EMSCRIPTEN_KEEPALIVE
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Export function to find prime numbers count up to n
EMSCRIPTEN_KEEPALIVE
int countPrimes(int n) {
    if (n < 2) return 0;
    
    int count = 0;
    for (int i = 2; i <= n; i++) {
        int isPrime = 1;
        for (int j = 2; j * j <= i; j++) {
            if (i % j == 0) {
                isPrime = 0;
                break;
            }
        }
        if (isPrime) count++;
    }
    return count;
}

// Add your new function
EMSCRIPTEN_KEEPALIVE
int isPrime(int n) {
    if (n < 2) return 0;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return 0;
    }
    return 1;
}
