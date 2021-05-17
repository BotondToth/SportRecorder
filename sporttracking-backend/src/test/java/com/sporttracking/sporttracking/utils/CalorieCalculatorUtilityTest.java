package com.sporttracking.sporttracking.utils;

import com.sporttracking.sporttracking.utility.CalorieCalculatorUtility;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

public class CalorieCalculatorUtilityTest {

    @Test
    public void testWalkingCalculation() {
        long burntCaloriesByWalking = CalorieCalculatorUtility.calculate(10, 80, "Walking");
        assertNotEquals(0, burntCaloriesByWalking);
        assertEquals(35, burntCaloriesByWalking);
    }

    @Test
    public void testCyclingCalculation() {
        long burntCaloriesByCycling = CalorieCalculatorUtility.calculate(10, 80, "Cycling");
        assertNotEquals(0, burntCaloriesByCycling);
        assertEquals(70, burntCaloriesByCycling);
    }

    @Test
    public void testSwimmingCalculation() {
        long burntCaloriesBySwimming = CalorieCalculatorUtility.calculate(10, 80, "Swimming");
        assertNotEquals(0, burntCaloriesBySwimming);
        assertEquals(56, burntCaloriesBySwimming);
    }

    @Test
    public void testRunningCalculation() {
        long burntCaloriesByRunning = CalorieCalculatorUtility.calculate(10, 80, "Running");
        assertNotEquals(0, burntCaloriesByRunning);
        assertEquals(112, burntCaloriesByRunning);
    }

    @Test
    public void testIncorrectCalculation() {
        long incorrectCalories = CalorieCalculatorUtility.calculate(10, 80, "random");
        assertEquals(0, incorrectCalories);
    }

}
