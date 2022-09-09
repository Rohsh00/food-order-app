import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";
import classes from "./AvailableMeals.module.css";
import { useEffect, useState } from "react";

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMeals = async () => {
    const response = await fetch(
      "https://react-http-fc24f-default-rtdb.firebaseio.com/meals.json"
    );

    if (!response.ok) {
      throw new Error("Request failed!");
    }

    const data = await response.json();

    const loadedMeals = [];
    setIsLoading(false);

    for (const mealsKey in data) {
      for (const meals of data[mealsKey]) {
        loadedMeals.push({
          id: meals.id,
          name: meals.name,
          description: meals.description,
          price: meals.price,
        });
      }
    }

    setMeals(loadedMeals);
  };
  useEffect(() => {
    fetchMeals().catch((err) => {
      setIsLoading(false);
      setError(err.message);
    });
  }, []);

  if (isLoading) {
    return (
      <section className={classes.mealsLoading}>
        <p>Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={classes.mealsError}>
        <p>{error}</p>
      </section>
    );
  }

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        {error}
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
