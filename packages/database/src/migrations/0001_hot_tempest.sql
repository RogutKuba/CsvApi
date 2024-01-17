ALTER TABLE `users` MODIFY COLUMN `public_id` varchar(50);--> statement-breakpoint
CREATE INDEX `public_id_idx` ON `users` (`public_id`);