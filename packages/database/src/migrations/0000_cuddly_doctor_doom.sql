CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`public_id` text NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`email` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	PRIMARY KEY (`id`),
);
