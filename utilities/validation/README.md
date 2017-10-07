
# Basic JavaScript Validation

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)


## What does it do
* Generic functions for common input data to ease developers from the task of always having to look up regexes or methods to validate

## Install

```javascript
import { isValidEmail, isValidPhoneNumber, isValidZipcode, isValidIBAN, isValidLuhnNumber } from './src/modules/util/validation';
```

## How to use

### isValidEmail

Accept an email in string format:

```javascript
console.log( isValidEmail( 'kees@tamtam.nl' ) );
// true

console.log( isValidEmail( 'XSS' ) );
// false
```

### isValidPhoneNumber

Checks for dutch phone numbers, if other countries should be supported, then a second parameter for a new regex is optional

```javascript
console.log( isValidPhoneNumber( '0612345678' ) );
// true

console.log( isValidPhoneNumber( '+491517953677', /^[0-9]*\/*(\+49)*[ ]*(\([0-9]+\))*([ ]*(-|–)*[ ]*[0-9]+)*$/) ); // German phone number
// true

console.log( isValidPhoneNumber( 'XSS' ) );
// false
```

### isValidZipcode

Checks for dutch zipcodes, if other countries should be supported, then a second parameter for a new regex is optional

```javascript
console.log( isValidZipcode( '1234AB' ) );
// true

console.log( isValidZipcode( '1234 AB' ) );
// true

console.log( isValidZipcode( '0123AB' ) ); // Dutch zipcodes don't start with a zero
// false

console.log( isValidPhoneNumber( 'SW1A 0AA', /^([A-Z]){1}([0-9][0-9]|[0-9]|[A-Z][0-9][A-Z]|[A-Z][0-9][0-9]|[A-Z][0-9]|[0-9][A-Z]){1}([ ])?([0-9][A-z][A-z]){1}$/i) ); // UK zipcode
// true
```

### isValidIBAN

Validates IBAN bank account numbers

```javascript
console.log( isValidIBAN( 'NL39 RABO 0300 0652 64' ) );
// true

console.log( isValidIBAN( 'NL39RABO0300065264' ) );
// true

console.log( isValidIBAN( 'NL39 RABO 0300 0652 6' ) );
// false
```

### isValidLuhnNumber

Applies [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm) to validate credit card and OV-chipkaart numbers

```javascript
console.log( isValidLuhnNumber( '349240158397275' ) );
// true

console.log( isValidLuhnNumber( '3528123412341234' ) );
// false
```

## Dependencies
* [iban](https://www.npmjs.com/package/iban)
* [luhn](https://www.npmjs.com/package/luhn)

## Developers
* [Kees van Lierop](mailto:kees@tamtam.nl)
