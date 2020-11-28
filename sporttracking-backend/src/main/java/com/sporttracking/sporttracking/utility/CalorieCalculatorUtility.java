package com.sporttracking.sporttracking.utility;

import com.sporttracking.sporttracking.strategies.CyclingStrategy;
import com.sporttracking.sporttracking.strategies.RunningStrategy;
import com.sporttracking.sporttracking.strategies.SwimmingStrategy;
import com.sporttracking.sporttracking.strategies.WalkingStrategy;

public class CalorieCalculatorUtility {

    public static long calculate(long duration, long weight, String type) {

        CalorieCalculatorContext context;

        switch (type) {
            case "Walking":
                context  = new CalorieCalculatorContext(new WalkingStrategy());
                return context.executeStrategy(duration, weight);
            case "Cycling":
                context  = new CalorieCalculatorContext(new CyclingStrategy());
                return context.executeStrategy(duration, weight);
            case "Running":
                context  = new CalorieCalculatorContext(new RunningStrategy());
                return context.executeStrategy(duration, weight);
            case "Swimming":
                context = new CalorieCalculatorContext(new SwimmingStrategy());
                return context.executeStrategy(duration, weight);
            default:
                return 0;
        }
    }
}
