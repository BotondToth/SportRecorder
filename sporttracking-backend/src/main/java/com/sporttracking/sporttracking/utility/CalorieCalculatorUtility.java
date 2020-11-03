package com.sporttracking.sporttracking.utility;

public class CalorieCalculatorUtility {

    public static long calculate(long duration, long weight, String type) {

        switch (type) {
            case "Walking":
                return (long) (duration * 2.5 * 3.5 * weight / 200);
            case "Cycling":
                return (long) (duration * 5 * 3.5 * weight / 200);
            case "Running":
                return (long) (duration * 8 * 3.5 * weight / 200);
            default:
                return (long) 0;
        }
    }
}
