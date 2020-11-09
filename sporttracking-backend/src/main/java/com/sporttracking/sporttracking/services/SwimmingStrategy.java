package com.sporttracking.sporttracking.services;

public class SwimmingStrategy implements CalorieCalculatorStrategy {
    @Override
    public long calculate(final long duration, final long weight) {
        return (long) (duration * 4 * 3.5 * weight / 200);
    }
}
