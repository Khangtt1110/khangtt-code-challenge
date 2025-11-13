/**
 * Method A: Using a for loop
 * - Iteratively add numbers from 1 to n.
 */
var sum_to_n_a = function (n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

/**
 * Method B: Using the mathematical formula
 * - Uses Gauss' formula: sum = n * (n + 1) / 2
 * - Most efficient (O(1) time complexity).
 */
var sum_to_n_b = function (n) {
    return (n * (n + 1)) / 2;
};

/**
 * Method C: Using recursion
 * - Base case: if n <= 0, return 0
 * - Recursive case: n + sum_to_n_c(n - 1)
 */
var sum_to_n_c = function (n) {
    if (n <= 0) return 0;
    return n + sum_to_n_c(n - 1);
};

// Example test
console.log(sum_to_n_a(5)); // 15
console.log(sum_to_n_b(5)); // 15
console.log(sum_to_n_c(5)); // 15
