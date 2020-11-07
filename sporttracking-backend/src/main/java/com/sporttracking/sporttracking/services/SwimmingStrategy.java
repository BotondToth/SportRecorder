package com.sporttracking.sporttracking.services;

public class SwimmingStrategy implements CalorieCalculatorStrategy {
    @Override
    public long calculate(long duration, long weight) {
        return (long) (duration * 4 * 3.5 * weight / 200);
    }
}
