-- -----------------------------------------------------
-- Table `Users`
-- -----------------------------------------------------
CREATE TABLE `Users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(45) NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) VISIBLE)
ENGINE = InnoDB;

-- Add User Data
INSERT INTO `Users` (`user_id`, `user_name`) VALUES
(1, 'MidnightCraze'),
(2, 'QuantumSparkle'),
(3, 'SolarFlare98'),
(4, 'FrostedNinja'),
(5, 'StarryWhisper'),
(6, 'ThunderWanderer'),
(7, 'RubyRhapsody'),
(8, 'MysticScribe'),
(9, 'NeonSpectrum'),
(10, 'SereneBreeze'),
(11, 'CosmicPioneer'),
(12, 'VelvetVoyager'),
(13, 'ElectricJester'),
(14, 'CrystalEchoes'),
(15, 'LunarHarmony'),
(16, 'EnchantedWanderlust'),
(17, 'PixelNomad'),
(18, 'SerendipityDream'),
(19, 'TechnoSorcerer'),
(20, 'AuroraHiker');

-- -----------------------------------------------------
-- Table `Recipes`
-- -----------------------------------------------------
CREATE TABLE `Recipes` (
  `recipe_id` INT NOT NULL AUTO_INCREMENT,
  `recipe_name` VARCHAR(145) NOT NULL,
  `ingredients` VARCHAR(245) NOT NULL,
  `instructions` VARCHAR(445) NOT NULL,
  `creator_id` INT NOT NULL,
  PRIMARY KEY (`recipe_id`),
  UNIQUE INDEX `recipe_id_UNIQUE` (`recipe_id` ASC) VISIBLE,
  INDEX `creator_id_idx` (`creator_id` ASC) VISIBLE,
  CONSTRAINT `creator_id`
    FOREIGN KEY (`creator_id`)
    REFERENCES `Users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- Add Recipe Data
INSERT INTO `Recipes` (`recipe_id`, `recipe_name`, `ingredients`, `instructions`, `creator_id`) VALUES
(1, 'Classic Spaghetti Carbonara', '200g spaghetti, 2 large eggs, 100g pancetta, 50g Pecorino cheese, black pepper', '1. Boil spaghetti.\n2. Whisk eggs, cheese, and pepper.\n3. Fry pancetta and mix with pasta.\n4. Add egg mixture and toss.', 1),
(2, 'Grilled Chicken Salad', '300g grilled chicken, mixed greens, cherry tomatoes, cucumber, red onion, balsamic vinaigrette', '1. Grill chicken and slice.\n2. Toss greens, tomatoes, cucumber, and onion.\n3. Drizzle with balsamic vinaigrette.\n4. Top with grilled chicken.', 1),
(3, 'Vegetable Stir-Fry', 'Assorted vegetables (bell peppers, broccoli, carrots, snap peas), tofu or chicken, soy sauce, sesame oil', '1. Cut vegetables and protein.\n2. Stir-fry protein until cooked.\n3. Add vegetables and stir-fry.\n4. Season with soy sauce and sesame oil.', 1),
(4, 'Homemade Margherita Pizza', 'Pizza dough, tomato sauce, fresh mozzarella cheese, fresh basil leaves, olive oil', '1. Roll out pizza dough.\n2. Spread tomato sauce.\n3. Top with cheese and basil.\n4. Bake until crust is golden.\n5. Drizzle with olive oil.', 4),
(5, 'Creamy Garlic Mashed Potatoes', 'Potatoes, butter, milk, garlic, salt, pepper', '1. Boil and mash potatoes.\n2. Melt butter and sauté minced garlic.\n3. Add garlic, butter, milk to potatoes.\n4. Season with salt and pepper.', 5),
(6, 'Baked Salmon with Lemon-Dill Sauce', 'Salmon fillet, lemon, fresh dill, olive oil, salt, pepper', '1. Preheat oven.\n2. Place salmon on baking sheet.\n3. Drizzle with olive oil, lemon juice, dill, salt, and pepper.\n4. Bake until cooked.', 6),
(7, 'Chocolate Chip Cookies', 'Flour, butter, brown sugar, white sugar, eggs, vanilla extract, chocolate chips', '1. Cream butter and sugars.\n2. Beat in eggs and vanilla.\n3. Mix in dry ingredients and chocolate chips.\n4. Drop spoonfuls onto baking sheet.\n5. Bake until golden.', 7),
(8, 'Creamy Tomato Basil Soup', 'Tomatoes, onion, garlic, vegetable broth, cream, fresh basil, salt, pepper', '1. Sauté onion and garlic.\n2. Add tomatoes, broth, and seasonings.\n3. Simmer and blend.\n4. Stir in cream and chopped basil.', 8),
(9, 'Beef Tacos with Salsa', 'Ground beef, taco seasoning, tortillas, lettuce, tomato salsa, shredded cheese', '1. Brown beef and add taco seasoning.\n2. Warm tortillas.\n3. Fill tortillas with beef, lettuce, salsa, and cheese.', 9),
(10, 'Homemade Vegetable Soup', 'Assorted vegetables (carrots, celery, potatoes, beans), vegetable broth, herbs, salt, pepper', '1. Chop vegetables.\n2. Sauté and add broth, herbs, salt, and pepper.\n3. Simmer until vegetables are tender.', 10),
(11, 'Chicken and Broccoli Alfredo', 'Chicken breast, broccoli, fettuccine, Alfredo sauce, Parmesan cheese', '1. Cook chicken and slice.\n2. Boil fettuccine and steam broccoli.\n3. Mix pasta, sauce, and cheese.\n4. Top with chicken and broccoli.', 11),
(12, 'Berry Smoothie Bowl', 'Mixed berries (strawberries, blueberries, raspberries), banana, Greek yogurt, granola', '1. Blend berries, banana, and yogurt.\n2. Pour into bowl.\n3. Top with granola and additional berries.', 12),
(13, 'Garlic Shrimp Scampi', 'Shrimp, linguine, butter, garlic, white wine, lemon juice, parsley', '1. Sauté shrimp in butter and garlic.\n2. Cook linguine.\n3. Deglaze with white wine and lemon juice.\n4. Toss with pasta and garnish with parsley.', 13),
(14, 'Vegan Chickpea Curry', 'Chickpeas, coconut milk, curry spices, onion, garlic, tomato, spinach', '1. Sauté onion and garlic.\n2. Add spices, chickpeas, tomato, and coconut milk.\n3. Simmer and stir in spinach.\n4. Serve with rice.', 14),
(15, 'Blueberry Pancakes', 'Pancake mix, blueberries, milk, eggs, maple syrup', '1. Mix pancake batter.\n2. Gently fold in blueberries.\n3. Cook pancakes.\n4. Serve with maple syrup.', 15),
(16, 'Beef Stir-Fry with Broccoli', 'Beef strips, broccoli, soy sauce, ginger, garlic, sesame oil', '1. Marinate beef in soy sauce, ginger, and garlic.\n2. Stir-fry beef.\n3. Add blanched broccoli.\n4. Drizzle with sesame oil and serve.', 16),
(17, 'Caprese Salad', 'Tomatoes, fresh mozzarella cheese, fresh basil leaves, balsamic glaze, olive oil', '1. Slice tomatoes and cheese.\n2. Arrange alternately with basil leaves.\n3. Drizzle with olive oil and balsamic glaze.', 17),
(18, 'Creamy Chicken Pot Pie', 'Chicken, mixed vegetables, pie crust, chicken broth, cream, thyme', '1. Cook chicken and vegetables.\n2. Make cream sauce with broth and cream.\n3. Combine filling and sauce.\n4. Top with pie crust and bake.', 18),
(19, 'Peanut Butter Banana Smoothie', 'Banana, peanut butter, milk, Greek yogurt, honey', '1. Blend banana, peanut butter, milk, and yogurt.\n2. Sweeten with honey to taste.', 19),
(20, 'Homemade Beef Burger', 'Ground beef, burger buns, lettuce, tomato, onion, cheese, condiments', '1. Shape beef into patties.\n2. Grill or cook on stovetop.\n3. Assemble burgers with toppings and condiments.', 20);


-- -----------------------------------------------------
-- Table `Ratings`
-- -----------------------------------------------------
CREATE TABLE .`Ratings` (
  `rating_id` INT NOT NULL AUTO_INCREMENT,
  `recipe_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `rating` INT NOT NULL,
  `written_review` VARCHAR(445) NULL,
  PRIMARY KEY (`rating_id`),
  UNIQUE INDEX `rating_id_UNIQUE` (`rating_id` ASC) VISIBLE,
  INDEX `recipe_id_idx` (`recipe_id` ASC) VISIBLE,
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `recipe_id`
    FOREIGN KEY (`recipe_id`)
    REFERENCES `Recipes` (`recipe_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `Users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- Add Rating Data
INSERT INTO `Ratings` (`rating_id`, `recipe_id`, `user_id`, `rating`, `written_review`) VALUES
(1, 1, 1, 4, 'Delicious and easy to make!'),
(2, 1, 3, 5, 'Best carbonara I ever had!'),
(3, 2, 2, 5, 'Perfectly grilled chicken and fresh salad.'),
(4, 2, 5, 4, 'Healthy and satisfying.'),
(5, 3, 4, 4, 'Tasty stir-fry with a great balance of flavors.'),
(6, 3, 7, 3, 'Could use a bit more seasoning.'),
(7, 4, 1, 5, 'Homemade pizza done right.'),
(8, 4, 6, 4, 'Simple and delicious.'),
(9, 5, 3, 5, 'Creamy and flavorful mashed potatoes.'),
(10, 5, 8, 4, 'Great side dish!'),
(11, 6, 5, 4, 'Salmon was perfectly cooked.'),
(12, 6, 9, 5, 'Lemon-dill sauce adds a nice touch.'),
(13, 7, 2, 5, 'Classic chocolate chip cookies.'),
(14, 7, 10, 4, 'Chewy and delightful.'),
(15, 8, 1, 5, 'Velvety tomato soup with a hint of basil.'),
(16, 8, 3, 3, 'A bit too creamy for my taste.'),
(17, 9, 4, 4, 'Savory beef tacos with a zesty salsa.'),
(18, 9, 11, 5, 'Authentic Mexican flavors.'),
(19, 10, 6, 4, 'Hearty and comforting vegetable soup.'),
(20, 10, 12, 3, 'Could use more seasoning.'),
(21, 11, 7, 5, 'Creamy alfredo sauce perfectly coats the pasta.'),
(22, 11, 13, 4, 'Great weeknight dinner.'),
(23, 12, 9, 4, 'Refreshing smoothie bowl packed with berries.'),
(24, 12, 14, 5, 'A tasty and nutritious breakfast.'),
(25, 13, 11, 5, 'Garlic shrimp scampi is a hit!'),
(26, 13, 15, 4, 'Loved the flavors.'),
(27, 14, 10, 4, 'Flavorful vegan chickpea curry.'),
(28, 14, 16, 3, 'A bit too spicy for me.'),
(29, 15, 12, 5, 'Fluffy blueberry pancakes.'),
(30, 15, 17, 4, 'Perfect for a weekend brunch.'),
(31, 16, 14, 4, 'Quick and delicious beef stir-fry.'),
(32, 16, 18, 5, 'Satisfying and flavorful.'),
(33, 17, 16, 5, 'Refreshing and simple Caprese salad.'),
(34, 17, 19, 4, 'Always a crowd-pleaser.'),
(35, 18, 18, 5, 'Creamy chicken pot pie with a golden crust.'),
(36, 18, 20, 4, 'Comfort food at its finest.'),
(37, 19, 15, 5, 'Peanut butter and banana, a classic combo.'),
(38, 19, 1, 4, 'Great smoothie for a quick snack.'),
(39, 20, 2, 5, 'Juicy and flavorful homemade burger.'),
(40, 20, 4, 4, 'Perfectly grilled patties.');
