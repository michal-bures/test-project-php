<?php

class FormValidator {

    # The maximum length for text fields based on the "text" type in MySQL
    const MAX_TEXT_LENGTH = 65535;

    # We expect phone numbers in international format
    const PHONE_NUMBER_REGEXP = '/^\+\d{7,15}$/';

    /**
     * Validates input based on list of validators configured fore each field
     * Side note: it would probably make more sense to just use a validation library such as
     * https://github.com/rakit/validation, but that feels like cheating
     * param $data: Array with input fields that will be sanitized end mutated
     * param $config: array where keys are field names and values are arrays of validators for each field
     * returns array where keys are field names and values error messages; if validation of all fields passed, return empty array
     */
    public function validate($data, $config) {
        $errors = array();

        # for each field in config
        foreach ($config as $fieldName => $fieldValidators) {
          # for each validator specified for the given field
          foreach ($fieldValidators as $validator) {
              # run the validator
              $fieldValue = ($data[$fieldName] ?? NULL);
              $errorMessage = $this::$validator($data[$fieldName] ?? NULL);
              if ($errorMessage) {
                  $errors[$fieldName] = $errorMessage;
                  # only report the first error for each field, don't run subsequent validators
                  break;
              }
          }
        }

        return $errors;
    }

    public function email($value) {
        if (empty($value)) return;
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
          return "Please enter a valid email address.";
        }
    }

    public function name($value) {
        if (empty($value)) return;
        if (strlen($value)<2) {
          return "Name should have at least two characters.";
        }
    }

    public function required($value) {
      if (empty($value)) return "Field is required.";
    }

    public function phoneNumber($value) {
      if (empty($value)) return;
      if (!preg_match(self::PHONE_NUMBER_REGEXP, $value)) return "Please enter the phone number in international format, such as +420123456789.";
    }

    public function text($value) {
      if (empty($value)) return;
      if (!is_string($value)) return "Must be be a text value.";
      if (strlen($value)>self::MAX_TEXT_LENGTH) return "Input is too long.";
    }
}

return new FormValidator();
