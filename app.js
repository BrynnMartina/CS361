const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const pool = mysql.createPool({
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_devaanb',
    password: 'GEm5DdE7Sby6',
    database: 'cs340_devaanb'
});


// Shows the average rating for each recipe
app.get('/recipes/average-ratings', async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT r.recipe_id, r.recipe_name, AVG(rt.rating) AS average_rating
        FROM Recipes r
        LEFT JOIN Ratings rt ON r.recipe_id = rt.recipe_id
        GROUP BY r.recipe_id, r.recipe_name
      `);
  
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Shows the recipe details and average rating for a specific recipe
// Example: To view the details and average rating for recipe #4, the URL would be /recipes/4/details-and-average-rating
app.get('/recipes/:recipeId/details-and-average-rating', async (req, res) => {
    const recipeId = req.params.recipeId;
    try {
        const [recipeRows] = await pool.query(`
            SELECT r.*, u.user_name
            FROM Recipes r
            LEFT JOIN Users u ON r.creator_id = u.user_id
            WHERE r.recipe_id = ?
        `, [recipeId]);

        if (recipeRows.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        const [ratingRows] = await pool.query(`
            SELECT AVG(rating) AS average_rating
            FROM Ratings
            WHERE recipe_id = ?
        `, [recipeId]);

        const averageRating = ratingRows[0].average_rating || 0; // If no ratings, default to 0
        const recipeDetailsWithRating = { ...recipeRows[0], average_rating: averageRating, image_url: recipeRows[0].image_filename };

        res.json(recipeDetailsWithRating);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Shows recipes in order of average rating, from highest rating to lowest
app.get('/recipes/ordered-by-rating', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT R.recipe_id,
                   R.recipe_name,
                   IFNULL(AVG(rt.rating), 0) AS avg_rating,
                   U.user_name
            FROM Recipes AS R
            LEFT JOIN Ratings AS rt ON R.recipe_id = rt.recipe_id
            LEFT JOIN Users AS U ON R.creator_id = U.user_id
            GROUP BY R.recipe_id, R.recipe_name
            ORDER BY avg_rating DESC;
        `);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Shows recipes with an average rating of X or higher, ordered from highest rating to lowest
// Example: To look at recipes with a rating of 4.2 stars or higher, the URL would be /recipes/high-rated/4.2
app.get('/recipes/high-rated/:minRating', async (req, res) => {
    const minRating = parseFloat(req.params.minRating);

    if (isNaN(minRating)) {
        res.status(400).json({ error: 'Invalid minimum rating' });
        return;
    }

    try {
        const [rows] = await pool.query(`
            SELECT R.recipe_id,
                   R.recipe_name,
                   IFNULL(AVG(rt.rating), 0) AS avg_rating,
                   U.user_name
            FROM Recipes AS R
            LEFT JOIN Ratings AS rt ON R.recipe_id = rt.recipe_id
            LEFT JOIN Users AS U ON R.creator_id = U.user_id
            GROUP BY R.recipe_id, R.recipe_name
            HAVING avg_rating >= ?
            ORDER BY avg_rating DESC;
        `, [minRating]);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Shows recipes in alphabetical order
app.get('/recipes/alphabetical', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT R.recipe_id,
                   R.recipe_name,
                   IFNULL(AVG(rt.rating), 0) AS avg_rating,
                   U.user_name
            FROM Recipes AS R
            LEFT JOIN Ratings AS rt ON R.recipe_id = rt.recipe_id
            LEFT JOIN Users AS U ON R.creator_id = U.user_id
            GROUP BY R.recipe_id, R.recipe_name
            ORDER BY R.recipe_name;
        `);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Shows all users with their associated user_id and user_name
app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Shows a specific user
// Example: To view user #8, the URL would be /users/8
app.get('/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await pool.query('SELECT * FROM Users WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Shows all of the ratings a selected user has given
// Example: To view user #3's ratings, the URL would be /users/3/ratings
// Output: [{"rating_id":2,"recipe_id":1,"user_id":3,"rating":5,"written_review":"Best carbonara I ever had!"},
//          {"rating_id":9,"recipe_id":5,"user_id":3,"rating":5,"written_review":"Creamy and flavorful mashed potatoes."},
//          {"rating_id":16,"recipe_id":8,"user_id":3,"rating":3,"written_review":"A bit too creamy for my taste."}]
// Interpretation: User 3 has reviewed 3 recipes - #1, #5, & #8
app.get('/users/:userId/ratings', async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await pool.query('SELECT * FROM Ratings WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Shows all of the recipes a selected user has posted
// Example: To view user #19's recipes, the URL would be /users/19/recipes
// Output: [{"recipe_id":19,"recipe_name":"Peanut Butter Banana Smoothie","ingredients":"Banana, peanut butter, milk, 
//           Greek yogurt, honey","instructions":"1. Blend banana, peanut butter, milk, and yogurt.\n2. Sweeten with 
//           honey to taste.","creator_id":19}]
// Interpretation: User has posted one recipe - the Peanut Butter Banana Smoothie recipe
//
// DISCLAIMER!! For simplicity, nearly all of the recipe_id's will have the same value as
//      the user_id's. AKA, user #19 made recipe #19. So don't be alarmed if the values
//      are the same. The only instance where this isn't true is for recipes #1-3. Those
//      three recipes were all posted by user #1.
app.get('/users/:userId/recipes', async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await pool.query('SELECT * FROM Recipes WHERE creator_id = ?', [userId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Shows all recipes with their associated recipe_id, recipe_name, ingredients, instructions, and creator_id
app.get('/recipes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Recipes');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Shows a specific recipe
// Example: To view recipe #13, the URL would be /recipes/13
app.get('/recipes/:recipeId', async (req, res) => {
  const recipeId = req.params.recipeId;
  try {
    const [rows] = await pool.query('SELECT * FROM Recipes WHERE recipe_id = ?', [recipeId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Shows which user posted the recipe
// Example: To view the user of recipe #3, the URL would be /recipes/3/user
// Output: [{"user_id":1,"user_name":"MidnightCraze"}]
// Interpretation: User #1 created recipe #3

// DISCLAIMER!! For simplicity, nearly all of the recipe_id's will have the same value as
//      the user_id's. AKA, user #10 made recipe #10. So don't be alarmed if the values
//      are the same. The only instance where this isn't true is for recipes #1-3. Those
//      three recipes were all posted by user #1 (like in the example above).
app.get('/recipes/:recipeId/user', async (req, res) => {
  const recipeId = req.params.recipeId;
  try {
    const [rows] = await pool.query('SELECT * FROM Recipes WHERE recipe_id = ?', [recipeId]);
    if (rows.length > 0) {
      const userId = rows[0].creator_id;
      const [userRows] = await pool.query('SELECT * FROM Users WHERE user_id = ?', [userId]);
      res.json(userRows);
    } else {
      res.status(404).json({ error: 'Recipe not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Shows all the ratings for a selected recipe
// Example: To view all the ratings for recipe #11, the URL would be /recipes/11/ratings
// Output: [{"rating_id":21,"recipe_id":11,"user_id":7,"rating":5,"written_review":"Creamy alfredo sauce perfectly coats the pasta."},
//          {"rating_id":22,"recipe_id":11,"user_id":13,"rating":4,"written_review":"Great weeknight dinner."}]
// Interpretation: Recipe #11 has two ratings - one 5 star and one 4 star
app.get('/recipes/:recipeId/ratings', async (req, res) => {
    const recipeId = req.params.recipeId;
    try {
      const query = `
        SELECT Ratings.*, Users.user_name
        FROM Ratings
        JOIN Users ON Ratings.user_id = Users.user_id
        WHERE Ratings.recipe_id = ?
      `;
      const [rows] = await pool.query(query, [recipeId]);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Shows all ratings with their associated rating_id, recipe_id, user_id, rating, and written_review
app.get('/ratings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Ratings');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Shows a specific rating
// Example: To view the 10th rating posted, the URL would be /ratings/10
app.get('/ratings/:ratingId', async (req, res) => {
  const ratingId = req.params.ratingId;
  try {
    const [rows] = await pool.query('SELECT * FROM Ratings WHERE rating_id = ?', [ratingId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Shows the user of a specific rating
// Example: To view which user posted the 10th rating, the URL would be /ratings/10/user
app.get('/ratings/:ratingId/user', async (req, res) => {
  const ratingId = req.params.ratingId;
  try {
    const [rows] = await pool.query('SELECT * FROM Ratings WHERE rating_id = ?', [ratingId]);
    if (rows.length > 0) {
      const userId = rows[0].user_id;
      const [userRows] = await pool.query('SELECT * FROM Users WHERE user_id = ?', [userId]);
      res.json(userRows);
    } else {
      res.status(404).json({ error: 'Rating not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Shows the recipe of a specific rating
// Example: To view which recipe the 10th rating is talking about, the URL would be /ratings/10/recipe
app.get('/ratings/:ratingId/recipe', async (req, res) => {
  const ratingId = req.params.ratingId;
  try {
    const [rows] = await pool.query('SELECT * FROM Ratings WHERE rating_id = ?', [ratingId]);
    if (rows.length > 0) {
      const recipeId = rows[0].recipe_id;
      const [recipeRows] = await pool.query('SELECT * FROM Recipes WHERE recipe_id = ?', [recipeId]);
      res.json(recipeRows);
    } else {
      res.status(404).json({ error: 'Rating not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





// Add a recipe
app.post('/recipes/add', async (req, res) => {
    const { recipe_name, ingredients, instructions, creator_id } = req.body;

    if (!recipe_name || !ingredients || !instructions || !creator_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO Recipes (recipe_name, ingredients, instructions, creator_id) VALUES (?, ?, ?, ?)',
            [recipe_name, ingredients, instructions, creator_id]
        );

        const newRecipeId = result.insertId;
        const [newRecipe] = await pool.query(
            'SELECT * FROM Recipes WHERE recipe_id = ?',
            [newRecipeId]
        );

        res.status(201).json(newRecipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a recipe
app.delete('/recipes/:recipeId', async (req, res) => {
    const recipeId = req.params.recipeId;
  
    try {
      const [result] = await pool.query('DELETE FROM Recipes WHERE recipe_id = ?', [recipeId]);
  
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Recipe not found' });
      } else {
        res.json({ message: 'Recipe deleted successfully' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Add a rating
app.post('/recipes/:recipeId/ratings', async (req, res) => {
    const recipeId = req.params.recipeId;
    const { user_id, rating, written_review } = req.body;
  
    try {
      const [result] = await pool.query(
        'INSERT INTO Ratings (recipe_id, user_id, rating, written_review) VALUES (?, ?, ?, ?)',
        [recipeId, user_id, rating, written_review]
      );
  
      if (result.affectedRows === 1) {
        res.json({ message: 'Rating added successfully' });
      } else {
        res.status(500).json({ error: 'Failed to add rating' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Delete a rating
app.delete('/ratings/:ratingId', async (req, res) => {
    const ratingId = req.params.ratingId;
  
    try {
      const [result] = await pool.query('DELETE FROM Ratings WHERE rating_id = ?', [ratingId]);
  
      if (result.affectedRows === 1) {
        res.json({ message: 'Rating deleted successfully' });
      } else {
        res.status(404).json({ error: 'Rating not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Add a user
app.post('/users', async (req, res) => {
    const { user_name, email } = req.body;
  
    try {
      const [result] = await pool.query('INSERT INTO Users (user_name, email) VALUES (?, ?)', [user_name, email]);
  
      if (result.affectedRows === 1) {
        res.json({ message: 'User added successfully' });
      } else {
        res.status(500).json({ error: 'Failed to add user' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Delete a user
app.delete('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const [result] = await pool.query('DELETE FROM Users WHERE user_id = ?', [userId]);
  
      if (result.affectedRows === 1) {
        res.json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});