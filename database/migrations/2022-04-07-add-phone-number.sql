-- add phone number to users as optional attribute
-- (for sake of exercise, I am pretending the app was already deployed previously, so a migration is more appropriate
-- than a simple change in schema.sql)
ALTER TABLE users ADD phone VARCHAR(20);
