package com.sporttracking.sporttracking.utils;

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


}
