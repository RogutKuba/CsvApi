CREATE TABLE `list_items` (
	`id` varchar(50) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`completed` boolean NOT NULL,
	`user_id` varchar(50) NOT NULL,
	CONSTRAINT `list_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint