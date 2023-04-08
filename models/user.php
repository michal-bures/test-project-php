<?php


/**
 * User model
 */
class User extends BaseModel{

	// Define neccessary constants so we know from which table to load data
	const tableName = 'users';
	// ClassName constant is important for find and findOne static functions to work
	const className = 'User';

    private $validator;

	public function __construct($db) {
	    parent::__construct($db);
		$this->validator = require_once dirname(__FILE__).'/../validator.php';
	}

	// Create getter functions

	public function getName() {
		return $this->getField('name');
	}

	public function getEmail() {
		return $this->getField('email');
	}

	public function getCity() {
		return $this->getField('city');
	}

    public function getPhoneNumber() {
        return $this->getField('phone');
    }

	// create/update functions

	public function insert($data = []) {
	    $sanitized_data = self::sanitize($data);
        $errors = self::validate($sanitized_data);

        if (empty($errors)) {
            parent::insert($sanitized_data);
            return array(
                "success"=>true,
                "user"=>$sanitized_data
            );
        } else {
            return array(
                "success"=>false,
                "errors"=>$errors
            );
        }
    }

    public function sanitize($data) {
        return array_map('trim',array(
            'name' => filter_var($data['name'], FILTER_SANITIZE_SPECIAL_CHARS),
            'email' => filter_var($data['email'], FILTER_SANITIZE_EMAIL),
            'city' => filter_var($data['city'], FILTER_SANITIZE_SPECIAL_CHARS),
            'phone' => $this::sanitizePhoneNumber($data['phone'])
        ));
    }

    private function sanitizePhoneNumber($value) {
      $value = filter_var($value, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
      $value = preg_replace('/[^+0-9]/', '', $value);
      return $value;
    }


    public function validate($data) {
        return $this->validator->validate($data, array(
               'name' => ['required', 'text', 'name'],
               'email' => ['required', 'text', 'email'],
               'city' => ['required', 'text'],
               'phone' => ['phoneNumber']
        ));
    }

}

