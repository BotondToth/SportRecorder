package com.sporttracking.sporttracking.utils;

import com.sporttracking.sporttracking.strategies.CyclingStrategy;
import com.sporttracking.sporttracking.strategies.RunningStrategy;
import com.sporttracking.sporttracking.strategies.SwimmingStrategy;
import com.sporttracking.sporttracking.strategies.WalkingStrategy;
import com.sporttracking.sporttracking.utility.CalorieCalculatorContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

public class CalorieCalculatorContextTest {

    private CalorieCalculatorContext calorieCalculatorContext;

    @AfterEach
    public void tearDown() {
        calorieCalculatorContext = null;
    }

    @Test
    public void testWalkingCalculatorStrategyExecuted() {
        calorieCalculatorContext = new CalorieCalculatorContext(new WalkingStrategy());
        final long executedStrategyResult = calorieCalculatorContext.executeStrategy(10, 80);
        assertNotEquals(0, executedStrategyResult);
        assertEquals(35, executedStrategyResult);
        assertEquals(WalkingStrategy.class, calorieCalculatorContext.getStrategy().getClass());
    }

    @Test
    public void testSwimmingCalculatorStrategyExecuted() {
        calorieCalculatorContext = new CalorieCalculatorContext(new SwimmingStrategy());
        final long executedStrategyResult = calorieCalculatorContext.executeStrategy(10, 80);
        assertNotEquals(0, executedStrategyResult);
        assertEquals(56, executedStrategyResult);
        assertEquals(SwimmingStrategy.class, calorieCalculatorContext.getStrategy().getClass());
    }

    @Test
    public void testRunningCalculatorStrategyExecuted() {
        calorieCalculatorContext = new CalorieCalculatorContext(new RunningStrategy());
        final long executedStrategyResult = calorieCalculatorContext.executeStrategy(10, 80);
        assertNotEquals(0, executedStrategyResult);
        assertEquals(112, executedStrategyResult);
        assertEquals(RunningStrategy.class, calorieCalculatorContext.getStrategy().getClass());
    }

    @Test
    public void testCyclingCalculatorStrategyExecuted() {
        calorieCalculatorContext = new CalorieCalculatorContext(new CyclingStrategy());
        final long executedStrategyResult = calorieCalculatorContext.executeStrategy(10, 80);
        assertNotEquals(0, executedStrategyResult);
        assertEquals(70, executedStrategyResult);
        assertEquals(CyclingStrategy.class, calorieCalculatorContext.getStrategy().getClass());
    }

}
