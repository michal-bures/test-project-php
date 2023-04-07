<?php

#TODO more explicit import
require_once dirname(__FILE__)."/../validators.php";

/**
 * User model
 */
class User extends BaseModel{
	
	// Define neccessary constansts so we know from which table to load data
	const tableName = 'users';
	// ClassName constant is important for find and findOne static functions to work
	const className = 'User';
	
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

	// create/update functions

	public function insert($data = []) {
	    $sanitized_data = sanitize($data);
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

    public function validate($data = []) {
        return validate($data, array(
               'name' => ['required', 'text', 'name'],
               'email' => ['required', 'text', 'email'],
               'city' => ['required', 'text']
        ));
    }
	
}
