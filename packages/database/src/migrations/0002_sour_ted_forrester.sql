ALTER TABLE `users` MODIFY COLUMN `public_id` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `work_os_id` text NOT NULL;