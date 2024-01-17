CREATE TABLE `users` (
	`public_id` varchar(50) NOT NULL,
	`work_os_id` text NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`email` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	CONSTRAINT `users_public_id` PRIMARY KEY(`public_id`)
);
