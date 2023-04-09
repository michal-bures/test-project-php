# PHP Test Project
Appivia.com

### TODO
Things that I would ideally also implement, but didn't get to in the given time box:
- validation on client side
- thorough review of base_model.php for SQL injection vulnerabilities (all the SQL stitching seems very dangerous)
- add linter and formatter
- js minification and polyfills in case older browser support is required
- monitoring (logging, client-side error tracking, analytics)
- move things into a dedicated folder for served files rather than relying on correctly configured .htaccess
- nicer phone number picker with country code picker and other UX improvements
- branding, dark mode support and other visual polish

### Description
This is a very simple one-page application consisting of a single table and a form for creating new rows. To make it a little more complicated, we have written a 'framework' you have to use. Below is a set of simple tasks to perform. Please write a production-ready code.

### Installation
1. Fork this repository
2. Create a new MySQL database
3. Rename `config/database` to `config/database.php` and configure your database connection settings in this file
4. Import `database/schema.sql` into your database

### Tasks to perform
1. Style the page using [Bootstrap](http://getbootstrap.com/):
  * Every other table row should be highlighted.
  * Use Bootstrap’s form-horizontal to style the form.
  * Any other styling changes should be made based on your preference. Please make the interface look presentable!
2. Add a validation of new records.
3. Create a JS functionality to filter rows by city.
4. Implement submission of the form using AJAX.
5. Add a phone number column to the table.
6. Please deploy the project to any freehosting and send us the production link.
