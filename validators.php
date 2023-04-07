<?php

# The maximum length for text fields based on the Text column limit in MySQL
define('MAX_TEXT_LENGTH', 65535);


/**
 * Validates input based on validator functions configured for each field
 * param $data: Array with input fields
 * param $config: array where keys are field names and values are arrays of validators for each field
 */
function validate($data, $config) {
    $errors = array();

    foreach ($config as $fieldName => $fieldValidators) {
      foreach ($fieldValidators as $validator) {
          $errorMessage = $validator($data[$fieldName]);
          if ($errorMessage) {
              $errors[$fieldName] = $errorMessage;
              # only report the first error for each field
              break;
          }
      }
    }

    return $errors;
}

function sanitize($data) {
    $trimmed_data = array_map('trim', $data);
    return $trimmed_data;
}

function email($value) {
    if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
      return "does not seem to be a valid email address";
    }
}

function name($value) {
    if (strlen($value)<2) {
      return "name should have at least two characters";
    }
}

function required($value) {
  if (empty($value)) return "field is required";
}

function text($value) {
  if (!is_string($value)) return "must be a text value";
  if (strlen($value)>MAX_TEXT_LENGTH) return "input is too long";
}

