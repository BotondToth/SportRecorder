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
        long burntCaloriesByWalking = CalorieCalculatorUtility.calculate(10, 80, "Cycling");
        assertNotEquals(0, burntCaloriesByWalking);
        assertEquals(70, burntCaloriesByWalking);
    }

}
