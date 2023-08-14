import requests

# Define the base URL of your Node.js microservice
base_url = 'http://localhost:3000'

# Example: Making a GET request to retrieve recipe details and average rating
def get_recipe_details(recipe_id):
    endpoint = f'/recipes/{recipe_id}/details-and-average-rating'
    url = base_url + endpoint

    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return None

# Example: Making a POST request to add a new recipe
def add_recipe(recipe_data):
    endpoint = '/recipes/add'
    url = base_url + endpoint

    response = requests.post(url, json=recipe_data)
    if response.status_code == 201:
        return response.json()
    else:
        return None

# Example usage
if __name__ == '__main__':
    recipe_data = {
        "recipe_name": "New Recipe",
        "ingredients": "Ingredient 1, Ingredient 2",
        "instructions": "Step 1, Step 2",
        "creator_id": 1
    }

    new_recipe = add_recipe(recipe_data)
    if new_recipe:
        print("New recipe added:", new_recipe)
    else:
        print("Failed to add new recipe")

    recipe_id = 1
    recipe_details = get_recipe_details(recipe_id)
    if recipe_details:
        print("Recipe details:", recipe_details)
    else:
        print("Recipe details not found")