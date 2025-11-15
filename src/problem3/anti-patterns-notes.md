# 📦 Anti-Pattern Report: `WalletPage` Component

This document outlines a series of anti-patterns identified in the original implementation of the `WalletPage` React component using TypeScript. Each item includes a description of the issue, its impact, and the solution applied or recommended.

---

## 1. Use of `any` Type in `getPriority` Function

**Issue:**  
The `getPriority` function accepts a parameter typed as `any`, which disables type checking.

**Impact:**  
Increases the risk of runtime errors and undermines the benefits of TypeScript’s static type system.

**Solution:**  
Replace `any` with `string` and use an `enum` to constrain valid blockchain values.

---

## 2. Hardcoded Priority Logic via `switch` Statement

**Issue:**  
Priority values are hardcoded using a `switch` block.

**Impact:**  
Makes the logic harder to maintain and error-prone when adding or modifying blockchain types.

**Solution:**  
Use a centralized `enum` (`BlockchainPriority`) to define and manage priority values.

---

## 3. Use of Undeclared Variable `lhsPriority`

**Issue:**  
The `filter` function references `lhsPriority`, which is not declared.

**Impact:**  
Causes runtime errors and breaks component functionality.

**Solution:**  
Replace with the correct variable `balancePriority`.

---

## 4. Redundant Calls to `getPriority` During Filtering and Sorting

**Issue:**  
`getPriority` is invoked multiple times per item in both `filter` and `sort`.

**Impact:**  
Leads to unnecessary computation and reduced performance.

**Solution:**  
Optimize by caching priority values or memoizing the computation.

---

## 5. Using `index` as React Key

**Issue:**  
The `rows` list uses `key={index}` for rendering.

**Impact:**  
Can cause rendering inconsistencies and performance issues when the list changes.

**Solution:**  
Use a stable and unique key such as `balance.currency` or a composite key like `${blockchain}-${currency}`.

---

## 6. Rendering from `sortedBalances` Instead of `formattedBalances`

**Issue:**  
The `rows` are generated from `sortedBalances`, but expect the shape of `FormattedWalletBalance`.

**Impact:**  
May result in missing fields or type mismatches.

**Solution:**  
Render from `formattedBalances` to ensure all required fields are present.

---

## 7. No Fallback for Missing Price Data

**Issue:**  
Accessing `prices[balance.currency]` without checking for existence.

**Impact:**  
Can lead to runtime errors if the price is `undefined`.

**Solution:**  
Add a fallback using the nullish coalescing operator: `prices[balance.currency] ?? 0`.

---

## 8. Missing `useMemo` for `formattedBalances` and `rows`

**Issue:**  
These arrays are recalculated on every render.

**Impact:**  
Reduces performance, especially with frequent updates or large datasets.

**Solution:**  
Wrap both in `useMemo` with appropriate dependency arrays.

---

## 9. Missing `blockchain` Field in `WalletBalance` Interface

**Issue:**  
The `getPriority` function relies on `balance.blockchain`, but the `WalletBalance` interface does not declare this field.

**Impact:**  
Causes type errors and potential runtime failures.

**Solution:**  
Add `blockchain: string` to the `WalletBalance` interface.

---

## 10. Unused `children` Prop

**Issue:**  
The `children` prop is destructured but never used.

**Impact:**  
Adds unnecessary noise and potential confusion.

**Solution:**  
Remove destructuring of `children` from the component props.
